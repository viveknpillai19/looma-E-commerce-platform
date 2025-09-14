package com.looma.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
// This filter will run once for every request.
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Get the Authorization header from the request.
        final String authHeader = request.getHeader("Authorization");

        // 2. Check if the header is present and starts with "Bearer ".
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // If not, pass the request to the next filter.
            return;
        }

        // 3. Extract the token from the header.
        final String jwt = authHeader.substring(7); // "Bearer ".length() is 7
        final String userEmail = jwtUtil.extractUsername(jwt);

        // 4. Check if we have an email and the user is not already authenticated.
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 5. Load user details from the database.
            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(userEmail);

            // 6. Validate the token.
            if (jwtUtil.validateToken(jwt, userDetails)) {
                // 7. If valid, create an authentication token.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 8. Set the authentication in the Spring Security context.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 9. Pass the request to the next filter in the chain.
        filterChain.doFilter(request, response);
    }
}