package com.nexoria.api.support;

import com.nexoria.api.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/support/messages")
@Tag(name = "Support Messages", description = "Client portal and admin support message threads.")
@SecurityRequirement(name = "bearerAuth")
public class SupportController {
    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping("/mine")
    @Operation(summary = "List support messages for the current client")
    public List<SupportMessageResponse> mine(@AuthenticationPrincipal User user) {
        return supportService.listMine(user);
    }

    @PostMapping("/mine")
    @Operation(summary = "Send a client support message")
    public ResponseEntity<SupportMessageResponse> sendMine(@AuthenticationPrincipal User user,
                                                           @Valid @RequestBody SupportMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supportService.sendClientMessage(user, request));
    }

    @GetMapping(value = "/mine/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream support messages for the current client")
    public SseEmitter streamMine(@AuthenticationPrincipal User user) {
        return supportService.streamMine(user);
    }

    @GetMapping("/admin")
    @Operation(summary = "List all support messages for admins")
    public List<SupportMessageResponse> adminMessages() {
        return supportService.listAllForAdmin();
    }

    @PostMapping("/admin/{clientEmail}/reply")
    @Operation(summary = "Reply to a client support thread")
    public ResponseEntity<SupportMessageResponse> reply(@PathVariable String clientEmail,
                                                        @Valid @RequestBody SupportMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supportService.sendAdminReply(clientEmail, request));
    }

    @GetMapping(value = "/admin/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream all support messages for admins")
    public SseEmitter streamAdmin() {
        return supportService.streamAdmin();
    }
}
