package com.nexoria.api.schedule;

import com.nexoria.api.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduling")
@Tag(name = "Scheduling", description = "Public scheduling flow and admin scheduling controls.")
public class SchedulingController {
    private final SchedulingService schedulingService;

    public SchedulingController(SchedulingService schedulingService) {
        this.schedulingService = schedulingService;
    }

    @GetMapping("/availability")
    @Operation(summary = "Get public call availability")
    public PublicAvailabilityResponse availability() {
        return schedulingService.getPublicAvailability();
    }

    @PostMapping("/bookings")
    @Operation(summary = "Create a scheduled call from the public site")
    public ResponseEntity<ScheduledCallResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(schedulingService.createBooking(request));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get scheduling settings for the admin portal")
    @SecurityRequirement(name = "bearerAuth")
    public ScheduleSettingsResponse settings() {
        return schedulingService.getSettings();
    }

    @PutMapping("/settings")
    @Operation(summary = "Update scheduling settings for the admin portal")
    @SecurityRequirement(name = "bearerAuth")
    public ScheduleSettingsResponse updateSettings(@Valid @RequestBody ScheduleSettingsRequest request) {
        return schedulingService.updateSettings(request);
    }

    @GetMapping("/bookings/admin")
    @Operation(summary = "List scheduled calls for the admin portal")
    @SecurityRequirement(name = "bearerAuth")
    public List<ScheduledCallResponse> listBookings() {
        return schedulingService.listCalls();
    }

    @GetMapping("/bookings/mine")
    @Operation(summary = "List scheduled calls for the current client")
    @SecurityRequirement(name = "bearerAuth")
    public List<ScheduledCallResponse> myBookings(@AuthenticationPrincipal User user) {
        return schedulingService.getCurrentUserCalls(user);
    }

    @PatchMapping("/bookings/{id}/clear")
    @Operation(summary = "Clear a booked slot so it becomes available again")
    @SecurityRequirement(name = "bearerAuth")
    public ScheduledCallResponse clearBooking(@PathVariable Long id) {
        return schedulingService.clearCall(id);
    }
}
