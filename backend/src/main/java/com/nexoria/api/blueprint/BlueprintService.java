package com.nexoria.api.blueprint;

import com.nexoria.api.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
                            @Value("${config.retainerRevenueTiers:$10k–$50k/mo,$50k–$200k/mo,$200k+/mo}") String retainerRevenueTiers) {
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
        return repository.findByUser(user);
    }

    public Optional<Blueprint> findByIdAndUser(Long id, User user) {
        return repository.findByIdAndUser(id, user);
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

    private Blueprint mapRequest(BlueprintRequest request, User user) {
        Blueprint b = new Blueprint();
        b.setUser(user);
        b.setUrl(request.getUrl());
        b.setIndustry(request.getIndustry());
        b.setRevenueRange(request.getRevenueRange());
        b.setGoals(request.getGoals());
        b.setExternalSignal(request.getExternalSignal() != null ? request.getExternalSignal() : new ExternalSignal(10.0, 0, 15.0));
        return b;
    }

    public int computeScore(String industry, String revenueRange, List<String> goals, ExternalSignal externalSignal) {
        int industryBase = industryScore(industry);
        int revenueBase = revenueScore(revenueRange);
        int goalBonus = Math.min(goals != null ? goals.size() * 5 : 0, 20);
        double extNorm = Math.min(externalSignal.getWindspeed() / 100.0, 1.0);
        int extBonus = (int)Math.round(extNorm * weightExternal);

        double raw = (industryBase / 100.0) * weightIndustry
                + (revenueBase / 100.0) * weightRevenue
                + (goalBonus / 20.0) * weightGoals
                + (extBonus / (double)weightExternal) * weightExternal;

        return Math.min(100, Math.max(1, (int)Math.round(raw)));
    }

    private int industryScore(String industry) {
        switch (industry) {
            case "Remodeling": return 72;
            case "Marketing Agency": return 68;
            case "Consulting": return 74;
            case "E-commerce": return 65;
            case "Healthcare": return 58;
            case "Real Estate": return 70;
            case "Tech / SaaS": return 80;
            default: return 63;
        }
    }

    private int revenueScore(String revenue) {
        switch (revenue) {
            case "Under $5k/mo": return 30;
            case "$5k–$10k/mo": return 45;
            case "$10k–$50k/mo": return 60;
            case "$50k–$200k/mo": return 75;
            case "$200k+/mo": return 90;
            default: return 50;
        }
    }

    public List<FixRecommendation> buildFixes(List<String> goals, int score, ExternalSignal externalSignal) {
        Map<String, FixRecommendation> fixMap = loadFixMap();
        List<String> fallbacks = List.of("analytics","crm","reporting","seo","automation");
        Set<String> selected = new LinkedHashSet<>();

        if (goals != null) {
            for (String g : goals) {
                switch (g) {
                    case "More leads": selectKeys(selected, List.of("leads","seo","social"), 4); break;
                    case "Better retention": selectKeys(selected, List.of("retention","crm","analytics"), 4); break;
                    case "Automate tasks": selectKeys(selected, List.of("automation","reporting","payments"), 4); break;
                    case "Grow revenue": selectKeys(selected, List.of("lowRevenue","leads","automation"), 4); break;
                    case "Improve SEO": selectKeys(selected, List.of("seo","analytics","social"), 4); break;
                }
                if (selected.size() >= 4) break;
            }
        }

        if (!selected.contains("externalSignal") && selected.size() < 5) {
            selected.add("externalSignal");
        }

        for (String fallback : fallbacks) {
            if (selected.size() >= 5) break;
            selected.add(fallback);
        }

        List<FixRecommendation> result = new ArrayList<>();
        for (String key : selected) {
            if (result.size() >= 5) break;
            FixRecommendation fix = fixMap.get(key);
            if (fix != null) result.add(fix);
        }
        return result;
    }

    private void selectKeys(Set<String> selected, List<String> keys, int limit) {
        for (String key : keys) {
            if (selected.size() >= limit) break;
            selected.add(key);
        }
    }

    private Map<String, FixRecommendation> loadFixMap() {
        Map<String, FixRecommendation> map = new LinkedHashMap<>();
        map.put("automation", new FixRecommendation("Implement workflow automation", "High", "Medium", "Manual processes are your biggest time drain. Automating lead follow-up and invoicing alone saves 8–12 hrs/week."));
        map.put("leads", new FixRecommendation("Build a lead capture funnel", "High", "Medium", "No systematic funnel means you rely on referrals. A simple landing page + email sequence can 3× inbound leads."));
        map.put("retention", new FixRecommendation("Launch a client retention sequence", "High", "Low", "Retaining existing clients is 5× cheaper than acquiring new ones. A 6-email nurture sequence is the fastest win."));
        map.put("seo", new FixRecommendation("Optimise on-page SEO", "Medium", "Low", "Missing meta descriptions and slow load times suppress organic traffic. Quick wins available in under a day."));
        map.put("analytics", new FixRecommendation("Set up conversion tracking", "High", "Low", "You can't improve what you don't measure. GA4 + goal events take 2 hours and unlock data-driven decisions."));
        map.put("payments", new FixRecommendation("Streamline payment & invoicing", "Medium", "Low", "Late payments hurt cash flow. Automated invoicing + Stripe links cut collection time by ~70%."));
        map.put("social", new FixRecommendation("Systemise social media content", "Medium", "Medium", "Inconsistent posting kills algorithmic reach. A 2-week content calendar + scheduler fixes this permanently."));
        map.put("crm", new FixRecommendation("Deploy a lightweight CRM", "High", "Medium", "Contacts in spreadsheets mean dropped follow-ups. A CRM pipeline ensures nothing falls through the cracks."));
        map.put("reporting", new FixRecommendation("Build an automated weekly report", "Medium", "Low", "Stakeholders need visibility. An automated dashboard report builds trust and reduces status-call overhead."));
        map.put("lowRevenue", new FixRecommendation("Introduce a recurring revenue offer", "High", "High", "Project-based income is unpredictable. A retainer or subscription product stabilises monthly cash flow."));
        map.put("externalSignal", new FixRecommendation("Monitor external market conditions", "Low", "Low", "Macro signals (weather disruptions, economic shifts) affect demand. Set up a simple alert dashboard."));
        return map;
    }
}

