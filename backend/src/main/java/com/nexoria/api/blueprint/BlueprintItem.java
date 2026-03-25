package com.nexoria.api.blueprint;

import jakarta.persistence.*;

@Embeddable
public class BlueprintItem {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String value;

    public BlueprintItem() {
    }

    public BlueprintItem(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
