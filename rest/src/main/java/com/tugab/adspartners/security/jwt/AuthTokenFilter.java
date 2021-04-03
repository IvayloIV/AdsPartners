package com.tugab.adspartners.security.jwt;

import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.service.UserService;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final YoutubeService youtubeService;

    @Autowired
    private UserService userService;

    @Autowired
    public AuthTokenFilter(JwtUtils jwtUtils,
                           YoutubeService youtubeService) {
        this.jwtUtils = jwtUtils;
        this.youtubeService = youtubeService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getUserEmailFromJwtToken(jwt);
                String userToken = jwtUtils.getUserTokenFromJwtToken(jwt);
                UsernamePasswordAuthenticationToken authentication;

                if (userToken != null) {
                    Youtuber youtuber = this.youtubeService.findByEmail(email);
                    youtuber.setToken(userToken);
                    authentication = new UsernamePasswordAuthenticationToken(youtuber, null, youtuber.getAuthorities());
                } else {
                    User user = this.userService.findByEmail(email);
                    authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                }

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7, headerAuth.length());
        }

        return null;
    }
}
