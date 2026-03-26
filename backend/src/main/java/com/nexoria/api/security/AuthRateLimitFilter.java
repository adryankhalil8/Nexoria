package com.nexoria.api.security;

import com.nexoria.api.config.RateLimitProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties rateLimitProperties;
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    public AuthRateLimitFilter(RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        RateLimitProperties.Auth auth = rateLimitProperties.getAuth();
        if (!auth.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = resolveClientKey(request);
        Instant now = Instant.now();
        Duration window = auth.getWindow();

        Counter counter = counters.compute(key, (unused, existing) -> {
            if (existing == null || now.isAfter(existing.windowStart.plus(window))) {
                return new Counter(now, 1);
            }
            existing.count++;
            return existing;
        });

        response.setHeader("X-RateLimit-Limit", String.valueOf(auth.getCapacity()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(auth.getCapacity() - counter.count, 0)));

        if (counter.count > auth.getCapacity()) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("""
                    {"error":"Too Many Requests","details":"Auth rate limit exceeded. Please retry shortly."}
                    """.trim());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        String clientIp = forwardedFor != null && !forwardedFor.isBlank()
                ? forwardedFor.split(",")[0].trim()
                : request.getRemoteAddr();
        return request.getMethod() + ":" + request.getRequestURI() + ":" + clientIp;
    }

    private static final class Counter {
        private final Instant windowStart;
        private int count;

        private Counter(Instant windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
