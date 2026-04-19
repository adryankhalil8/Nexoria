package com.nexoria.api.support;

import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SupportService {
    private final SupportMessageRepository supportMessageRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

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
        return SupportMessageResponse.from(supportMessageRepository.save(message));
    }

    public List<SupportMessageResponse> listAllForAdmin() {
        return supportMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    public SupportMessageResponse sendAdminReply(String clientEmail, SupportMessageRequest request) {
        SupportMessage message = baseMessage(clientEmail, SupportMessageSender.ADMIN, request.getBody());
        userRepository.findByEmail(clientEmail).ifPresent(message::setClientUser);
        return SupportMessageResponse.from(supportMessageRepository.save(message));
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
}
