package com.nexoria.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    private final Cors cors = new Cors();
    private final Headers headers = new Headers();

    public Cors getCors() {
        return cors;
    }

    public Headers getHeaders() {
        return headers;
    }

    public static class Cors {
        private List<String> allowedOriginPatterns = new ArrayList<>(List.of("http://localhost:3000", "http://localhost:8080"));
        private List<String> allowedMethods = new ArrayList<>(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        private List<String> allowedHeaders = new ArrayList<>(List.of("*"));
        private boolean allowCredentials = true;

        public List<String> getAllowedOriginPatterns() {
            return allowedOriginPatterns;
        }

        public void setAllowedOriginPatterns(List<String> allowedOriginPatterns) {
            this.allowedOriginPatterns = allowedOriginPatterns;
        }

        public List<String> getAllowedMethods() {
            return allowedMethods;
        }

        public void setAllowedMethods(List<String> allowedMethods) {
            this.allowedMethods = allowedMethods;
        }

        public List<String> getAllowedHeaders() {
            return allowedHeaders;
        }

        public void setAllowedHeaders(List<String> allowedHeaders) {
            this.allowedHeaders = allowedHeaders;
        }

        public boolean isAllowCredentials() {
            return allowCredentials;
        }

        public void setAllowCredentials(boolean allowCredentials) {
            this.allowCredentials = allowCredentials;
        }
    }

    public static class Headers {
        private String contentSecurityPolicy = "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:; connect-src 'self' http://localhost:3000 http://localhost:8080;";
        private String referrerPolicy = "strict-origin-when-cross-origin";
        private String permissionsPolicy = "camera=(), geolocation=(), microphone=()";
        private boolean hstsEnabled = true;
        private long hstsMaxAgeSeconds = 31536000;
        private boolean hstsIncludeSubdomains = true;

        public String getContentSecurityPolicy() {
            return contentSecurityPolicy;
        }

        public void setContentSecurityPolicy(String contentSecurityPolicy) {
            this.contentSecurityPolicy = contentSecurityPolicy;
        }

        public String getReferrerPolicy() {
            return referrerPolicy;
        }

        public void setReferrerPolicy(String referrerPolicy) {
            this.referrerPolicy = referrerPolicy;
        }

        public String getPermissionsPolicy() {
            return permissionsPolicy;
        }

        public void setPermissionsPolicy(String permissionsPolicy) {
            this.permissionsPolicy = permissionsPolicy;
        }

        public boolean isHstsEnabled() {
            return hstsEnabled;
        }

        public void setHstsEnabled(boolean hstsEnabled) {
            this.hstsEnabled = hstsEnabled;
        }

        public long getHstsMaxAgeSeconds() {
            return hstsMaxAgeSeconds;
        }

        public void setHstsMaxAgeSeconds(long hstsMaxAgeSeconds) {
            this.hstsMaxAgeSeconds = hstsMaxAgeSeconds;
        }

        public boolean isHstsIncludeSubdomains() {
            return hstsIncludeSubdomains;
        }

        public void setHstsIncludeSubdomains(boolean hstsIncludeSubdomains) {
            this.hstsIncludeSubdomains = hstsIncludeSubdomains;
        }
    }
}
