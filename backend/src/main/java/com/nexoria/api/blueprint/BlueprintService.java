package com.nexoria.api.blueprint;

import com.nexoria.api.user.Role;
import com.nexoria.api.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class BlueprintService {

    private final BlueprintRepository repository;
    private final Integer weightIndustry;
    private final Integer weightGoals;
    private final Integer weightRevenue;
    private final Integer weightExternal;
    private final Integer retainerMinScore;
    private final List<String> retainerRevenueTiers;

    public BlueprintService(BlueprintRepository repository,
                            @Value("${config.weightIndustry:20}") Integer weightIndustry,
                            @Value("${config.weightGoals:30}") Integer weightGoals,
                            @Value("${config.weightRevenue:20}") Integer weightRevenue,
                            @Value("${config.weightExternal:30}") Integer weightExternal,
                            @Value("${config.retainerMinScore:45}") Integer retainerMinScore,
                            @Value("${config.retainerRevenueTiers:$10k-$50k/mo,$50k-$200k/mo,$200k+/mo}") String retainerRevenueTiers) {
        this.repository = repository;
        this.weightIndustry = weightIndustry;
        this.weightGoals = weightGoals;
        this.weightRevenue = weightRevenue;
        this.weightExternal = weightExternal;
        this.retainerMinScore = retainerMinScore;
        this.retainerRevenueTiers = Arrays.asList(retainerRevenueTiers.split(","));
    }

    public List<Blueprint> findAll() {
        return repository.findAll();
    }

    public Optional<Blueprint> findById(Long id) {
        return repository.findById(id);
    }

    public Blueprint save(Blueprint blueprint) {
        return repository.save(blueprint);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Blueprint> findAllByUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return repository.findAll();
        }

        return repository.findByUserOrClientEmailIgnoreCase(user, user.getEmail());
    }

    public Optional<Blueprint> findByIdAndUser(Long id, User user) {
        if (user.getRole() == Role.ADMIN) {
            return repository.findById(id);
        }

        return repository.findByIdAndUser(id, user)
                .or(() -> repository.findByIdAndClientEmailIgnoreCase(id, user.getEmail()));
    }

    public Blueprint computeAndSave(BlueprintRequest request, User user) {
        Blueprint blueprint = mapRequest(request, user);
        int score = computeScore(blueprint.getIndustry(), blueprint.getRevenueRange(), blueprint.getGoals(), blueprint.getExternalSignal());
        blueprint.setScore(score);
        blueprint.setReadyForRetainer(isReadyForRetainer(score, blueprint.getRevenueRange()));
        blueprint.setFixes(buildFixes(blueprint.getGoals(), score, blueprint.getExternalSignal()));
        return repository.save(blueprint);
    }

    public boolean isReadyForRetainer(int score, String revenueRange) {
        return score <= retainerMinScore && retainerRevenueTiers.contains(revenueRange);
    }

    public String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private Blueprint mapRequest(BlueprintRequest request, User user) {
        Blueprint blueprint = new Blueprint();
        blueprint.setUser(user);
        blueprint.setUrl(request.getUrl());
        blueprint.setIndustry(request.getIndustry());
        blueprint.setRevenueRange(request.getRevenueRange());
        blueprint.setClientEmail(blankToNull(request.getClientEmail()));
        blueprint.setGoals(request.getGoals());
        blueprint.setExternalSignal(request.getExternalSignal() != null ? request.getExternalSignal() : new ExternalSignal(10.0, 0, 15.0));
        blueprint.setStatus(request.getStatus() != null ? request.getStatus() : BlueprintStatus.APPROVED);
        blueprint.setPurchaseEventType(resolvePurchaseEventType(request));
        return blueprint;
    }

    public BlueprintStatus resolveStatus(BlueprintRequest request, Blueprint existing) {
        if (request.getStatus() != null) {
            return request.getStatus();
        }

        if (existing != null && existing.getStatus() != null) {
            return existing.getStatus();
        }

        return BlueprintStatus.APPROVED;
    }

    public PurchaseEventType resolvePurchaseEventType(BlueprintRequest request) {
        if (request.getPurchaseEventType() != null) {
            return request.getPurchaseEventType();
        }

        return purchaseEventTypeForIndustry(request.getIndustry());
    }

    public PurchaseEventType resolvePurchaseEventType(BlueprintRequest request, Blueprint existing) {
        if (request.getPurchaseEventType() != null) {
            return request.getPurchaseEventType();
        }

        if (existing != null && existing.getPurchaseEventType() != null) {
            return existing.getPurchaseEventType();
        }

        return purchaseEventTypeForIndustry(request.getIndustry());
    }

    public int computeScore(String industry, String revenueRange, List<String> goals, ExternalSignal externalSignal) {
        int industryBase = industryScore(industry);
        int revenueBase = revenueScore(revenueRange);
        int goalBonus = Math.min(goals != null ? goals.size() * 5 : 0, 20);
        double extNorm = Math.min(externalSignal.getWindspeed() / 100.0, 1.0);
        int extBonus = (int) Math.round(extNorm * weightExternal);

        double raw = (industryBase / 100.0) * weightIndustry
                + (revenueBase / 100.0) * weightRevenue
                + (goalBonus / 20.0) * weightGoals
                + (extBonus / (double) weightExternal) * weightExternal;

        return Math.min(100, Math.max(1, (int) Math.round(raw)));
    }

    private int industryScore(String industry) {
        return switch (industry) {
            case "Remodeling" -> 72;
            case "Marketing Agency" -> 68;
            case "Consulting" -> 74;
            case "E-commerce" -> 65;
            case "Healthcare" -> 58;
            case "Real Estate" -> 70;
            case "Tech / SaaS" -> 80;
            default -> 63;
        };
    }

    private int revenueScore(String revenue) {
        return switch (revenue) {
            case "Under $5k/mo" -> 30;
            case "$5k-$10k/mo" -> 45;
            case "$10k-$50k/mo" -> 60;
            case "$50k-$200k/mo" -> 75;
            case "$200k+/mo" -> 90;
            default -> 50;
        };
    }

    private PurchaseEventType purchaseEventTypeForIndustry(String industry) {
        return switch (industry) {
            case "Remodeling", "Real Estate" -> PurchaseEventType.BOOKED_JOB;
            case "E-commerce" -> PurchaseEventType.PURCHASE;
            default -> PurchaseEventType.DEPOSIT;
        };
    }

    public List<FixRecommendation> buildFixes(List<String> goals, int score, ExternalSignal externalSignal) {
        Map<String, FixRecommendation> fixMap = loadFixMap();
        List<String> fallbacks = List.of("analytics", "crm", "reporting", "seo", "automation");
        Set<String> selected = new LinkedHashSet<>();

        if (goals != null) {
            for (String goal : goals) {
                switch (goal) {
                    case "More leads" -> selectKeys(selected, List.of("leads", "seo", "social"), 4);
                    case "Better retention" -> selectKeys(selected, List.of("retention", "crm", "analytics"), 4);
                    case "Automate tasks" -> selectKeys(selected, List.of("automation", "reporting", "payments"), 4);
                    case "Grow revenue" -> selectKeys(selected, List.of("lowRevenue", "leads", "automation"), 4);
                    case "Improve SEO" -> selectKeys(selected, List.of("seo", "analytics", "social"), 4);
                    default -> {
                    }
                }
                if (selected.size() >= 4) {
                    break;
                }
            }
        }

        if (!selected.contains("externalSignal") && selected.size() < 5) {
            selected.add("externalSignal");
        }

        for (String fallback : fallbacks) {
            if (selected.size() >= 5) {
                break;
            }
            selected.add(fallback);
        }

        List<FixRecommendation> result = new ArrayList<>();
        for (String key : selected) {
            if (result.size() >= 5) {
                break;
            }
            FixRecommendation fix = fixMap.get(key);
            if (fix != null) {
                result.add(fix);
            }
        }
        return result;
    }

    public List<FixRecommendation> mergeFixes(List<FixRecommendation> existingFixes, List<FixRecommendation> generatedFixes) {
        Map<String, FixRecommendation> existingByTitle = new LinkedHashMap<>();
        if (existingFixes != null) {
            for (FixRecommendation fix : existingFixes) {
                if (fix != null && fix.getTitle() != null) {
                    existingByTitle.put(fix.getTitle(), fix);
                }
            }
        }

        List<FixRecommendation> merged = new ArrayList<>();
        for (FixRecommendation generated : generatedFixes) {
            FixRecommendation existing = existingByTitle.get(generated.getTitle());
            if (existing != null) {
                generated.setOwner(existing.getOwner());
                generated.setStatus(existing.getStatus());
                generated.setClientVisible(existing.getClientVisible());
            }
            merged.add(generated);
        }

        return merged;
    }

    private void selectKeys(Set<String> selected, List<String> keys, int limit) {
        for (String key : keys) {
            if (selected.size() >= limit) {
                break;
            }
            selected.add(key);
        }
    }

    private Map<String, FixRecommendation> loadFixMap() {
        Map<String, FixRecommendation> map = new LinkedHashMap<>();
        map.put("automation", new FixRecommendation("Implement workflow automation", "High", "Medium", "Manual processes are your biggest time drain. Automating lead follow-up and invoicing alone saves 8-12 hrs/week."));
        map.put("leads", new FixRecommendation("Build a lead capture funnel", "High", "Medium", "No systematic funnel means you rely on referrals. A simple landing page and email sequence can multiply inbound leads."));
        map.put("retention", new FixRecommendation("Launch a client retention sequence", "High", "Low", "Retaining existing clients is cheaper than acquiring new ones. A nurture sequence is usually the fastest win."));
        map.put("seo", new FixRecommendation("Optimize on-page SEO", "Medium", "Low", "Missing meta descriptions and slow load times suppress organic traffic. Quick wins are available in under a day."));
        map.put("analytics", new FixRecommendation("Set up conversion tracking", "High", "Low", "You can't improve what you don't measure. GA4 and goal events take two hours and unlock data-driven decisions."));
        map.put("payments", new FixRecommendation("Streamline payment and invoicing", "Medium", "Low", "Late payments hurt cash flow. Automated invoicing and payment links cut collection time significantly."));
        map.put("social", new FixRecommendation("Systemize social media content", "Medium", "Medium", "Inconsistent posting kills reach. A short content calendar and scheduler makes output repeatable."));
        map.put("crm", new FixRecommendation("Deploy a lightweight CRM", "High", "Medium", "Contacts in spreadsheets mean dropped follow-ups. A CRM pipeline ensures nothing falls through the cracks."));
        map.put("reporting", new FixRecommendation("Build an automated weekly report", "Medium", "Low", "Stakeholders need visibility. An automated dashboard report builds trust and reduces status-call overhead."));
        map.put("lowRevenue", new FixRecommendation("Introduce a recurring revenue offer", "High", "High", "Project-based income is unpredictable. A retainer or subscription product stabilizes monthly cash flow."));
        map.put("externalSignal", new FixRecommendation("Monitor external market conditions", "Low", "Low", "Macro signals such as weather disruptions and economic shifts affect demand. A simple alert dashboard adds useful context."));
        return map;
    }
}
