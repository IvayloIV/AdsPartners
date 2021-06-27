package com.tugab.adspartners.security;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.utils.JwtUtils;
import com.tugab.adspartners.service.AuthenticationService;
import com.tugab.adspartners.service.CompanyService;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final CompanyService companyService;
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthTokenFilter(JwtUtils jwtUtils,
                           YoutubeService youtubeService,
                           CompanyService companyService,
                           AuthenticationService authenticationService) {
        this.jwtUtils = jwtUtils;
        this.youtubeService = youtubeService;
        this.companyService = companyService;
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = this.parseJwt(request);

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getUserEmailFromJwtToken(jwt);
                String userToken = jwtUtils.getUserTokenFromJwtToken(jwt);
                UsernamePasswordAuthenticationToken authentication;

                if (userToken != null) {
                    Youtuber youtuber = this.youtubeService.findByEmail(email);
                    youtuber.setToken(userToken);
                    authentication = new UsernamePasswordAuthenticationToken(youtuber, null, youtuber.getAuthorities());
                } else {
                    UserDetails user = this.authenticationService.loadUserByUsername(email);
                    if (user.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(a -> a.equals(Authority.EMPLOYER.name()))) {
                        Company company = this.companyService.findByEmail(email);
                        authentication = new UsernamePasswordAuthenticationToken(company, null, user.getAuthorities());
                    } else {
                        authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    }
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
            return headerAuth.substring(7);
        }

        return null;
    }
}
