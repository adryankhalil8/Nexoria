package com.nexoria.api.schedule;

import com.nexoria.api.blueprint.BlueprintRepository;
import com.nexoria.api.user.Role;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class SchedulingServiceIntegrationTest {

    @Autowired
    private SchedulingService schedulingService;

    @Autowired
    private BlueprintRepository blueprintRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void createBookingRejectsDuplicateActiveBookingForSameEmail() {
        List<String> slots = schedulingService.getPublicAvailability().getAvailableSlots();
        assertThat(slots).hasSizeGreaterThan(1);

        String email = uniqueEmail("duplicate-booking");
        schedulingService.createBooking(bookingRequest(email, slots.get(0), CallSource.BOOK_A_CALL));

        CreateBookingRequest duplicate = bookingRequest(email, slots.get(1), CallSource.BOOK_A_CALL);

        assertThatThrownBy(() -> schedulingService.createBooking(duplicate))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already has a booked call");
    }

    @Test
    void getStartedBookingCreatesOnlyOneAssignedBlueprintForClientEmail() {
        ensureAdminExists();
        List<String> slots = schedulingService.getPublicAvailability().getAvailableSlots();
        assertThat(slots).hasSizeGreaterThan(1);

        String email = uniqueEmail("blueprint-once");
        ScheduledCallResponse firstCall = schedulingService.createBooking(bookingRequest(email, slots.get(0), CallSource.GET_STARTED));
        schedulingService.clearCall(firstCall.getId());
        schedulingService.createBooking(bookingRequest(email, slots.get(1), CallSource.GET_STARTED));

        assertThat(blueprintRepository.findByClientEmailIgnoreCase(email)).hasSize(1);
    }

    private CreateBookingRequest bookingRequest(String email, String slot, CallSource source) {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setCompany("Nexoria Test Client");
        request.setContactName("Taylor Client");
        request.setEmail(email);
        request.setWebsite("https://example.com");
        request.setIndustry("Consulting");
        request.setRevenueRange("$10k-$50k/mo");
        request.setGoals(List.of("More leads", "Grow revenue"));
        request.setScheduledStart(slot);
        request.setSource(source.name());
        return request;
    }

    private void ensureAdminExists() {
        if (userRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        User admin = new User("admin-" + UUID.randomUUID() + "@example.com", "password123", Role.ADMIN);
        admin.setUsernameValue("admin_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        userRepository.save(admin);
    }

    private String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@example.com";
    }
}
