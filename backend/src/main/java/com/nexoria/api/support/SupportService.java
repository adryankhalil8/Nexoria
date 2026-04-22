package com.nexoria.api.support;

import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Transactional
public class SupportService {
    private final SupportMessageRepository supportMessageRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final ConcurrentMap<String, CopyOnWriteArrayList<SseEmitter>> clientStreams = new ConcurrentHashMap<>();
    private final CopyOnWriteArrayList<SseEmitter> adminStreams = new CopyOnWriteArrayList<>();

    public SupportService(SupportMessageRepository supportMessageRepository,
                          LeadRepository leadRepository,
                          UserRepository userRepository) {
        this.supportMessageRepository = supportMessageRepository;
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    public List<SupportMessageResponse> listMine(User user) {
        return supportMessageRepository.findAllByClientEmailIgnoreCaseOrderByCreatedAtAsc(user.getEmail()).stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    public SupportMessageResponse sendClientMessage(User user, SupportMessageRequest request) {
        SupportMessage message = baseMessage(user.getEmail(), SupportMessageSender.CLIENT, request.getBody());
        message.setClientUser(user);
        SupportMessageResponse saved = SupportMessageResponse.from(supportMessageRepository.save(message));
        publish(saved);
        return saved;
    }

    public List<SupportMessageResponse> listAllForAdmin() {
        return supportMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    public SupportMessageResponse sendAdminReply(String clientEmail, SupportMessageRequest request) {
        SupportMessage message = baseMessage(clientEmail, SupportMessageSender.ADMIN, request.getBody());
        userRepository.findByEmail(clientEmail).ifPresent(message::setClientUser);
        SupportMessageResponse saved = SupportMessageResponse.from(supportMessageRepository.save(message));
        publish(saved);
        return saved;
    }

    public SseEmitter streamMine(User user) {
        String email = user.getEmail().trim().toLowerCase();
        SseEmitter emitter = createEmitter();
        clientStreams.computeIfAbsent(email, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeClientEmitter(email, emitter));
        emitter.onTimeout(() -> removeClientEmitter(email, emitter));
        emitter.onError(error -> removeClientEmitter(email, emitter));
        return emitter;
    }

    public SseEmitter streamAdmin() {
        SseEmitter emitter = createEmitter();
        adminStreams.add(emitter);
        emitter.onCompletion(() -> adminStreams.remove(emitter));
        emitter.onTimeout(() -> adminStreams.remove(emitter));
        emitter.onError(error -> adminStreams.remove(emitter));
        return emitter;
    }

    private SupportMessage baseMessage(String clientEmail, SupportMessageSender sender, String body) {
        String normalizedEmail = clientEmail.trim();
        SupportMessage message = new SupportMessage();
        message.setClientEmail(normalizedEmail);
        message.setBusinessName(resolveBusinessName(normalizedEmail));
        message.setSender(sender);
        message.setBody(body.trim());
        return message;
    }

    private String resolveBusinessName(String email) {
        return leadRepository.findFirstByEmailIgnoreCaseOrderByUpdatedAtDesc(email)
                .map(Lead::getCompany)
                .filter(company -> company != null && !company.isBlank())
                .orElse(email);
    }

    private SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(0L);
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (Exception ignored) {
            emitter.complete();
        }
        return emitter;
    }

    private void publish(SupportMessageResponse message) {
        emit(adminStreams, message);
        emit(clientStreams.get(message.getClientEmail().toLowerCase()), message);
    }

    private void emit(List<SseEmitter> emitters, SupportMessageResponse message) {
        if (emitters == null) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("message").data(message));
            } catch (Exception ex) {
                emitters.remove(emitter);
                closeQuietly(emitter);
            }
        }
    }

    private void closeQuietly(SseEmitter emitter) {
        try {
            emitter.complete();
        } catch (Exception ignored) {
            // The client already disconnected or the async response is already closed.
        }
    }

    private void removeClientEmitter(String email, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> emitters = clientStreams.get(email);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }
}
