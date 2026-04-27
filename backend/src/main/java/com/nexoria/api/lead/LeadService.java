package com.nexoria.api.lead;

import com.nexoria.api.user.Role;
import com.nexoria.api.user.User;
import com.nexoria.api.schedule.ScheduledCall;
import com.nexoria.api.schedule.ScheduledCallRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@Transactional
public class LeadService {
    private static final Pattern SEPARATOR_PATTERN = Pattern.compile("[._-]+");

    private final LeadRepository leadRepository;
    private final ScheduledCallRepository scheduledCallRepository;

    public LeadService(LeadRepository leadRepository, ScheduledCallRepository scheduledCallRepository) {
        this.leadRepository = leadRepository;
        this.scheduledCallRepository = scheduledCallRepository;
    }

    public List<LeadResponse> list(String search, LeadStatus status) {
        String normalizedSearch = search == null ? "" : search.trim().toLowerCase();

        return leadRepository.findAll().stream()
                .filter(lead -> status == null || lead.getStatus() == status)
                .filter(lead -> matchesSearch(lead, normalizedSearch))
                .sorted(Comparator.comparing(Lead::getUpdatedAt).reversed())
                .map(LeadResponse::from)
                .toList();
    }

    public LeadResponse create(LeadRequest request) {
        Lead lead = new Lead();
        apply(lead, request);
        return LeadResponse.from(leadRepository.save(lead));
    }

    public LeadResponse syncClientAccount(User user) {
        if (user.getRole() == Role.ADMIN) {
            return null;
        }

        Lead lead = leadRepository.findFirstByEmailIgnoreCaseOrderByUpdatedAtDesc(user.getEmail())
                .orElseGet(Lead::new);

        if (lead.getCompany() == null || lead.getCompany().isBlank()) {
            lead.setCompany(resolveCompany(user));
        }
        if (lead.getContactName() == null || lead.getContactName().isBlank()) {
            lead.setContactName(resolveContactName(user));
        }
        lead.setEmail(user.getEmail().trim());
        lead.setUser(user);

        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NEW);
        }

        return LeadResponse.from(leadRepository.save(lead));
    }

    public Lead requireClosedLead(String email) {
        Lead lead = leadRepository.findFirstByEmailIgnoreCaseOrderByUpdatedAtDesc(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("This email is not approved for account creation yet."));

        if (lead.getStatus() != LeadStatus.BOOKED && lead.getStatus() != LeadStatus.CLOSED) {
            throw new IllegalArgumentException("Book a call first or wait for the admin portal to mark this email closed before creating an account.");
        }

        return lead;
    }

    public String resolveDisplayName(User user) {
        if (user == null) {
            return "";
        }

        return leadRepository.findFirstByEmailIgnoreCaseOrderByUpdatedAtDesc(user.getEmail())
                .map(Lead::getContactName)
                .filter(name -> name != null && !name.isBlank())
                .orElseGet(() -> resolveContactName(user));
    }

    public LeadResponse update(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
        apply(lead, request);
        return LeadResponse.from(leadRepository.save(lead));
    }

    public void delete(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new IllegalArgumentException("Lead not found");
        }

        List<ScheduledCall> scheduledCalls = scheduledCallRepository.findAllByLeadId(id);
        for (ScheduledCall scheduledCall : scheduledCalls) {
            scheduledCall.setLead(null);
        }
        scheduledCallRepository.saveAll(scheduledCalls);

        leadRepository.deleteById(id);
    }

    private void apply(Lead lead, LeadRequest request) {
        lead.setCompany(request.getCompany());
        lead.setContactName(request.getContactName());
        lead.setEmail(request.getEmail());
        lead.setWebsite(blankToNull(request.getWebsite()));
        lead.setIndustry(blankToNull(request.getIndustry()));
        lead.setNotes(blankToNull(request.getNotes()));
        lead.setStatus(request.getStatus() == null ? LeadStatus.NEW : request.getStatus());

        if (lead.getUser() != null && !lead.getUser().getEmail().equalsIgnoreCase(request.getEmail())) {
            lead.setUser(null);
        }
    }

    private boolean matchesSearch(Lead lead, String search) {
        if (search.isBlank()) {
            return true;
        }

        return contains(lead.getCompany(), search)
                || contains(lead.getContactName(), search)
                || contains(lead.getEmail(), search)
                || contains(lead.getWebsite(), search)
                || contains(lead.getIndustry(), search);
    }

    private boolean contains(String value, String search) {
        return value != null && value.toLowerCase().contains(search);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String resolveCompany(User user) {
        String preferred = prettify(user.getUsernameValue());
        return preferred.isBlank() ? user.getEmail().trim() : preferred;
    }

    private String resolveContactName(User user) {
        String email = user.getEmail() == null ? "" : user.getEmail().trim();
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        String preferred = prettify(localPart);
        return preferred.isBlank() ? email : preferred;
    }

    private String prettify(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String normalized = value.replace("_at_", " ");
        normalized = SEPARATOR_PATTERN.matcher(normalized).replaceAll(" ").trim();

        if (normalized.isBlank()) {
            return "";
        }

        String[] words = normalized.split("\\s+");
        StringBuilder builder = new StringBuilder();

        for (String word : words) {
            if (word.isBlank()) {
                continue;
            }

            if (builder.length() > 0) {
                builder.append(' ');
            }

            String lower = word.toLowerCase(Locale.US);
            builder.append(Character.toUpperCase(lower.charAt(0)));

            if (lower.length() > 1) {
                builder.append(lower.substring(1));
            }
        }

        return builder.toString();
    }
}
