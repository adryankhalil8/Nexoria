package com.nexoria.api.blueprint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;

@Embeddable
@Schema(name = "ExternalSignal", description = "External context used when scoring a blueprint.")
public class ExternalSignal {

    @Schema(example = "12.3")
    private Double windspeed;
    @Schema(example = "1")
    private Integer weathercode;
    @Schema(example = "15.2")
    private Double temperature;

    public ExternalSignal() {}

    public ExternalSignal(Double windspeed, Integer weathercode, Double temperature) {
        this.windspeed = windspeed;
        this.weathercode = weathercode;
        this.temperature = temperature;
    }

    // Getters and Setters
    public Double getWindspeed() {
        return windspeed;
    }

    public void setWindspeed(Double windspeed) {
        this.windspeed = windspeed;
    }

    public Integer getWeathercode() {
        return weathercode;
    }

    public void setWeathercode(Integer weathercode) {
        this.weathercode = weathercode;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
}
