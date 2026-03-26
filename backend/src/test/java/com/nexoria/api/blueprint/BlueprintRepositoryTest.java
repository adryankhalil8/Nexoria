package com.nexoria.api.blueprint;

import com.nexoria.api.user.Role;
import com.nexoria.api.user.User;
import com.nexoria.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BlueprintRepositoryTest {

    @Autowired
    private BlueprintRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void whenSave_thenFindById() {
        User user = userRepository.save(new User("owner@example.com", "encodedPassword", Role.USER));

        Blueprint blueprint = new Blueprint();
        blueprint.setUser(user);
        blueprint.setUrl("https://example.com");
        blueprint.setIndustry("Tech / SaaS");
        blueprint.setRevenueRange("$50k-$200k/mo");
        blueprint.setGoals(List.of("More leads"));
        blueprint.setExternalSignal(new ExternalSignal(12.0, 1, 15.0));
        blueprint.setScore(66);
        blueprint.setReadyForRetainer(false);

        Blueprint saved = repository.save(blueprint);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUrl()).isEqualTo("https://example.com");
        assertThat(repository.findByIdAndUser(saved.getId(), user)).isPresent();
    }
}
