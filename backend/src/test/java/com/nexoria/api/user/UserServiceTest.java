package com.nexoria.api.user;

import com.nexoria.api.lead.Lead;
import com.nexoria.api.lead.LeadRepository;
import com.nexoria.api.lead.LeadService;
import com.nexoria.api.support.SupportMessage;
import com.nexoria.api.support.SupportMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private LeadService leadService;

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private SupportMessageRepository supportMessageRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void deleteUser_ClearsLeadAndSupportLinksBeforeRemovingUser() {
        User managedUser = new User("client@example.com", "encoded", Role.USER);
        managedUser.setId(15L);

        User admin = new User("admin@example.com", "encoded", Role.ADMIN);
        admin.setId(1L);

        Lead lead = new Lead();
        lead.setUser(managedUser);

        SupportMessage message = new SupportMessage();
        message.setClientUser(managedUser);

        when(userRepository.findById(15L)).thenReturn(Optional.of(managedUser));
        when(leadRepository.findAllByUserId(15L)).thenReturn(List.of(lead));
        when(supportMessageRepository.findAllByClientUserId(15L)).thenReturn(List.of(message));

        userService.deleteUser(15L, admin);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Lead>> leadCaptor = ArgumentCaptor.forClass(List.class);
        verify(leadRepository).saveAll(leadCaptor.capture());
        leadCaptor.getValue().forEach(savedLead -> assertNull(savedLead.getUser()));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<SupportMessage>> messageCaptor = ArgumentCaptor.forClass(List.class);
        verify(supportMessageRepository).saveAll(messageCaptor.capture());
        messageCaptor.getValue().forEach(savedMessage -> assertNull(savedMessage.getClientUser()));

        verify(userRepository).delete(managedUser);
    }

    @Test
    void deleteUser_CurrentUserCannotDeleteSelf() {
        User currentUser = new User("admin@example.com", "encoded", Role.ADMIN);
        currentUser.setId(4L);

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(4L, currentUser));

        verify(userRepository, never()).findById(4L);
    }

    @Test
    void deleteUser_MissingUserThrows() {
        User admin = new User("admin@example.com", "encoded", Role.ADMIN);
        admin.setId(1L);

        when(userRepository.findById(22L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(22L, admin));

        verify(leadRepository, never()).findAllByUserId(22L);
        verify(supportMessageRepository, never()).findAllByClientUserId(22L);
    }
}
