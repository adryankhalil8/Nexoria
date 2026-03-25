package com.nexoria.api.blueprint;

import jakarta.persistence.Embeddable;

@Embeddable
public class ExternalSignal {

    private Double windspeed;
    private Integer weathercode;
    private Double temperature;

    public ExternalSignal() {
    }

    public ExternalSignal(Double windspeed, Integer weathercode, Double temperature) {
        this.windspeed = windspeed;
        this.weathercode = weathercode;
        this.temperature = temperature;
    }

    public Double getWindspeed() { return windspeed; }
    public void setWindspeed(Double windspeed) { this.windspeed = windspeed; }
    public Integer getWeathercode() { return weathercode; }
    public void setWeathercode(Integer weathercode) { this.weathercode = weathercode; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
}
