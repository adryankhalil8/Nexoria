package com.nexoria.api.blueprint;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BlueprintRepositoryTest {

    @Autowired
    private BlueprintRepository repository;

    @Test
    void whenSave_thenFindById() {
        Blueprint b = new Blueprint();
        b.setUrl("https://example.com");
        b.setIndustry("Tech / SaaS");
        b.setRevenueRange("$50k–$200k/mo");
        b.setGoals(List.of("More leads"));
        b.setExternalSignal(new ExternalSignal(12.0, 1, 15.0));
        b.setScore(66);
        b.setReadyForRetainer(false);

        Blueprint saved = repository.save(b);
        assertThat(saved.getId()).isNotNull();

        Blueprint loaded = repository.findById(saved.getId()).orElseThrow();
        assertThat(loaded.getUrl()).isEqualTo("https://example.com");
    }
}
