package com.nexoria.api.lead;

import com.nexoria.api.schedule.ScheduledCall;
import com.nexoria.api.schedule.ScheduledCallRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeadServiceTest {

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private ScheduledCallRepository scheduledCallRepository;

    @InjectMocks
    private LeadService leadService;

    @Test
    void delete_ClearsScheduledCallLeadLinksBeforeRemovingLead() {
        when(leadRepository.existsById(12L)).thenReturn(true);

        ScheduledCall firstCall = new ScheduledCall();
        firstCall.setLead(new Lead());
        ScheduledCall secondCall = new ScheduledCall();
        secondCall.setLead(new Lead());
        when(scheduledCallRepository.findAllByLeadId(12L)).thenReturn(List.of(firstCall, secondCall));

        leadService.delete(12L);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ScheduledCall>> callsCaptor = ArgumentCaptor.forClass(List.class);
        verify(scheduledCallRepository).saveAll(callsCaptor.capture());
        callsCaptor.getValue().forEach(call -> assertNull(call.getLead()));
        verify(leadRepository).deleteById(12L);
    }

    @Test
    void delete_MissingLeadThrowsWithoutTouchingScheduledCalls() {
        when(leadRepository.existsById(99L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> leadService.delete(99L));

        verify(scheduledCallRepository, never()).findAllByLeadId(99L);
        verify(leadRepository, never()).deleteById(99L);
    }
}
