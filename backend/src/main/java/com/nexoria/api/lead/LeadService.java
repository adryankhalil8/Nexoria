package com.nexoria.api.lead;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class LeadService {
    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
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
}
