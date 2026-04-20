package com.nexoria.api.schedule;

import com.nexoria.api.blueprint.Blueprint;
import com.nexoria.api.blueprint.BlueprintRequest;
import com.nexoria.api.blueprint.BlueprintService;
import com.nexoria.api.user.Role;
import com.nexoria.api.user.UserRepository;
import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.lead.LeadStatus;
import com.nexoria.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class SchedulingService {
    private final ScheduleSettingsRepository settingsRepository;
    private final AvailabilityWindowRepository availabilityWindowRepository;
    private final ScheduledCallRepository scheduledCallRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final BlueprintService blueprintService;

    public SchedulingService(ScheduleSettingsRepository settingsRepository,
                             AvailabilityWindowRepository availabilityWindowRepository,
                             ScheduledCallRepository scheduledCallRepository,
                             LeadRepository leadRepository,
                             UserRepository userRepository,
                             BlueprintService blueprintService) {
        this.settingsRepository = settingsRepository;
        this.availabilityWindowRepository = availabilityWindowRepository;
        this.scheduledCallRepository = scheduledCallRepository;
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
        this.blueprintService = blueprintService;
    }

    public PublicAvailabilityResponse getPublicAvailability() {
        ScheduleSettings settings = ensureDefaults();
        List<Instant> slots = computeAvailableSlots(settings);
        return new PublicAvailabilityResponse(
                settings.getTimezone(),
                settings.getSlotDurationMinutes(),
                slots.stream().map(Instant::toString).toList()
        );
    }

    public ScheduledCallResponse createBooking(CreateBookingRequest request) {
        ScheduleSettings settings = ensureDefaults();
        ZoneId zoneId = parseZone(settings.getTimezone());
        Instant scheduledStart = parseInstant(request.getScheduledStart());
        Instant scheduledEnd = scheduledStart.plusSeconds(settings.getSlotDurationMinutes() * 60L);
        String email = request.getEmail().trim();

        if (!computeAvailableSlots(settings).contains(scheduledStart)) {
            throw new IllegalArgumentException("That time is no longer available. Please pick another slot.");
        }

        if (scheduledCallRepository.existsByEmailIgnoreCaseAndStatus(email, ScheduledCallStatus.BOOKED)) {
            throw new IllegalArgumentException("This email already has a booked call. Contact Nexoria if you need to reschedule.");
        }

        Lead lead = leadRepository.findFirstByEmailIgnoreCaseOrderByUpdatedAtDesc(email)
                .orElseGet(Lead::new);
        lead.setCompany(request.getCompany().trim());
        lead.setContactName(request.getContactName().trim());
        lead.setEmail(email);
        lead.setWebsite(blankToNull(request.getWebsite()));
        lead.setIndustry(blankToNull(request.getIndustry()));
        lead.setNotes(buildLeadNotes(request, scheduledStart, zoneId));
        lead.setStatus(LeadStatus.BOOKED);
        lead = leadRepository.save(lead);

        ScheduledCall call = new ScheduledCall();
        call.setLead(lead);
        call.setSource(parseSource(request.getSource()));
        call.setStatus(ScheduledCallStatus.BOOKED);
        call.setCompany(request.getCompany().trim());
        call.setContactName(request.getContactName().trim());
        call.setEmail(email);
        call.setWebsite(blankToNull(request.getWebsite()));
        call.setIndustry(blankToNull(request.getIndustry()));
        call.setNotes(blankToNull(request.getNotes()));
        call.setScheduledStart(scheduledStart);
        call.setScheduledEnd(scheduledEnd);
        call.setTimezone(settings.getTimezone());

        ScheduledCall saved = scheduledCallRepository.save(call);
        createIntakeBlueprintIfAvailable(request);
        return ScheduledCallResponse.from(saved);
    }

    public List<ScheduledCallResponse> listCalls() {
        return scheduledCallRepository.findAllByOrderByScheduledStartAsc().stream()
                .map(ScheduledCallResponse::from)
                .toList();
    }

    public ScheduledCallResponse clearCall(Long id) {
        ScheduledCall call = scheduledCallRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Scheduled call not found"));
        call.setStatus(ScheduledCallStatus.CLEARED);
        return ScheduledCallResponse.from(scheduledCallRepository.save(call));
    }

    public List<ScheduledCallResponse> getCurrentUserCalls(User user) {
        return scheduledCallRepository.findAllByLeadUserEmailIgnoreCaseOrderByScheduledStartAsc(user.getEmail()).stream()
                .map(ScheduledCallResponse::from)
                .toList();
    }

    public ScheduleSettingsResponse getSettings() {
        ScheduleSettings settings = ensureDefaults();
        return ScheduleSettingsResponse.from(settings, availabilityWindowRepository.findAllByOrderByDayOfWeekAscStartTimeAsc());
    }

    public ScheduleSettingsResponse updateSettings(ScheduleSettingsRequest request) {
        ScheduleSettings settings = ensureDefaults();
        parseZone(request.getTimezone());

        settings.setTimezone(request.getTimezone().trim());
        settings.setSlotDurationMinutes(request.getSlotDurationMinutes());
        settings.setBookingHorizonDays(request.getBookingHorizonDays());
        settingsRepository.save(settings);

        availabilityWindowRepository.deleteAllInBatch();
        List<AvailabilityWindow> windows = request.getAvailabilityWindows().stream()
                .map(this::toWindow)
                .sorted(Comparator.comparing(AvailabilityWindow::getDayOfWeek).thenComparing(AvailabilityWindow::getStartTime))
                .toList();
        availabilityWindowRepository.saveAll(windows);

        return ScheduleSettingsResponse.from(settings, availabilityWindowRepository.findAllByOrderByDayOfWeekAscStartTimeAsc());
    }

    private ScheduleSettings ensureDefaults() {
        ScheduleSettings settings = settingsRepository.findById(ScheduleSettings.SINGLETON_ID).orElseGet(() -> {
            ScheduleSettings created = new ScheduleSettings();
            created.setId(ScheduleSettings.SINGLETON_ID);
            return settingsRepository.save(created);
        });

        if (availabilityWindowRepository.count() == 0) {
            availabilityWindowRepository.saveAll(defaultWindows());
        }

        return settings;
    }

    private List<Instant> computeAvailableSlots(ScheduleSettings settings) {
        ZoneId zoneId = parseZone(settings.getTimezone());
        Map<DayOfWeek, List<AvailabilityWindow>> windowsByDay = new EnumMap<>(DayOfWeek.class);
        availabilityWindowRepository.findAllByOrderByDayOfWeekAscStartTimeAsc().stream()
                .filter(AvailabilityWindow::isActive)
                .forEach(window -> windowsByDay.computeIfAbsent(window.getDayOfWeek(), ignored -> new ArrayList<>()).add(window));

        List<ScheduledCall> activeCalls = scheduledCallRepository
                .findAllByStatusAndScheduledEndAfterOrderByScheduledStartAsc(ScheduledCallStatus.BOOKED, Instant.now());

        List<Instant> slots = new ArrayList<>();
        LocalDate today = LocalDate.now(zoneId);
        int duration = settings.getSlotDurationMinutes();

        for (int offset = 0; offset < settings.getBookingHorizonDays(); offset++) {
            LocalDate date = today.plusDays(offset);
            List<AvailabilityWindow> dayWindows = windowsByDay.getOrDefault(date.getDayOfWeek(), List.of());

            for (AvailabilityWindow window : dayWindows) {
                LocalTime cursor = window.getStartTime();
                while (!cursor.plusMinutes(duration).isAfter(window.getEndTime())) {
                    Instant start = LocalDateTime.of(date, cursor).atZone(zoneId).toInstant();
                    Instant end = start.plusSeconds(duration * 60L);

                    if (start.isAfter(Instant.now()) && isSlotAvailable(start, end, activeCalls)) {
                        slots.add(start);
                    }

                    cursor = cursor.plusMinutes(duration);
                }
            }
        }

        return slots;
    }

    private boolean isSlotAvailable(Instant start, Instant end, List<ScheduledCall> calls) {
        for (ScheduledCall call : calls) {
            if (call.getScheduledStart().isBefore(end) && start.isBefore(call.getScheduledEnd())) {
                return false;
            }
        }
        return true;
    }

    private AvailabilityWindow toWindow(AvailabilityWindowRequest request) {
        AvailabilityWindow window = new AvailabilityWindow();
        DayOfWeek dayOfWeek = parseDay(request.getDayOfWeek());
        LocalTime start = parseTime(request.getStartTime());
        LocalTime end = parseTime(request.getEndTime());

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("Availability windows must end after they start.");
        }

        window.setDayOfWeek(dayOfWeek);
        window.setStartTime(start);
        window.setEndTime(end);
        window.setActive(Boolean.TRUE.equals(request.getActive()));
        return window;
    }

    private List<AvailabilityWindow> defaultWindows() {
        return List.of(
                window(DayOfWeek.MONDAY, "07:00", "08:00"),
                window(DayOfWeek.MONDAY, "12:00", "13:00"),
                window(DayOfWeek.MONDAY, "18:00", "20:00"),
                window(DayOfWeek.TUESDAY, "07:00", "08:00"),
                window(DayOfWeek.TUESDAY, "12:00", "13:00"),
                window(DayOfWeek.TUESDAY, "18:00", "20:00"),
                window(DayOfWeek.WEDNESDAY, "07:00", "08:00"),
                window(DayOfWeek.WEDNESDAY, "12:00", "13:00"),
                window(DayOfWeek.WEDNESDAY, "18:00", "20:00"),
                window(DayOfWeek.THURSDAY, "07:00", "08:00"),
                window(DayOfWeek.THURSDAY, "12:00", "13:00"),
                window(DayOfWeek.THURSDAY, "18:00", "20:00"),
                window(DayOfWeek.FRIDAY, "07:00", "08:00"),
                window(DayOfWeek.FRIDAY, "12:00", "13:00"),
                window(DayOfWeek.FRIDAY, "18:00", "20:00"),
                window(DayOfWeek.SATURDAY, "11:00", "17:00"),
                window(DayOfWeek.SUNDAY, "11:00", "17:00")
        );
    }

    private AvailabilityWindow window(DayOfWeek dayOfWeek, String startTime, String endTime) {
        AvailabilityWindow window = new AvailabilityWindow();
        window.setDayOfWeek(dayOfWeek);
        window.setStartTime(parseTime(startTime));
        window.setEndTime(parseTime(endTime));
        window.setActive(true);
        return window;
    }

    private CallSource parseSource(String source) {
        try {
            return CallSource.valueOf(source.trim().toUpperCase());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Unknown booking source.");
        }
    }

    private Instant parseInstant(String value) {
        try {
            return Instant.parse(value.trim());
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid scheduled time.");
        }
    }

    private ZoneId parseZone(String timezone) {
        try {
            return ZoneId.of(timezone.trim());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Invalid timezone.");
        }
    }

    private DayOfWeek parseDay(String value) {
        try {
            return DayOfWeek.valueOf(value.trim().toUpperCase());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Invalid day of week.");
        }
    }

    private LocalTime parseTime(String value) {
        try {
            return LocalTime.parse(value.trim());
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid time value.");
        }
    }

    private String buildLeadNotes(CreateBookingRequest request, Instant scheduledStart, ZoneId zoneId) {
        StringBuilder builder = new StringBuilder();
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            builder.append(request.getNotes().trim());
        }
        if (builder.length() > 0) {
            builder.append("\n\n");
        }
        builder.append("Scheduled call: ")
                .append(LocalDateTime.ofInstant(scheduledStart, zoneId))
                .append(" ")
                .append(zoneId);
        return builder.toString();
    }

    private void createIntakeBlueprintIfAvailable(CreateBookingRequest request) {
        if (parseSource(request.getSource()) != CallSource.GET_STARTED) {
            return;
        }

        if (request.getWebsite() == null || request.getWebsite().isBlank()
                || request.getIndustry() == null || request.getIndustry().isBlank()
                || request.getRevenueRange() == null || request.getRevenueRange().isBlank()
                || request.getGoals() == null || request.getGoals().isEmpty()) {
            return;
        }

        userRepository.findFirstByRoleOrderByIdAsc(Role.ADMIN).ifPresent(admin -> {
            BlueprintRequest blueprintRequest = new BlueprintRequest();
            blueprintRequest.setUrl(request.getWebsite().trim());
            blueprintRequest.setIndustry(request.getIndustry().trim());
            blueprintRequest.setRevenueRange(request.getRevenueRange().trim());
            blueprintRequest.setGoals(request.getGoals());
            String email = request.getEmail().trim();

            if (blueprintService.findAll().stream()
                    .anyMatch(existing -> existing.getClientEmail() != null
                            && existing.getClientEmail().equalsIgnoreCase(email))) {
                return;
            }

            blueprintRequest.setClientEmail(email);

            Blueprint blueprint = blueprintService.computeAndSave(blueprintRequest, admin);
            blueprint.setClientEmail(email);
            blueprintService.save(blueprint);
        });
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
