package com.tugab.adspartners.security;

import com.tugab.adspartners.security.jwt.JwtUtils;
import com.tugab.adspartners.utils.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

import static com.tugab.adspartners.security.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2Repository;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(JwtUtils jwtUtils,
            HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2Repository) {
        this.jwtUtils = jwtUtils;
        this.httpCookieOAuth2Repository = httpCookieOAuth2Repository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
        String requestURL = redirectUri.orElse(getDefaultTargetUrl());
        String token = jwtUtils.generateJwtToken(authentication);

        String targetUrl = UriComponentsBuilder.fromUriString(requestURL)
                .queryParam("token", token)
                .build().toUriString();

        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2Repository.removeAuthorizationRequestCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
