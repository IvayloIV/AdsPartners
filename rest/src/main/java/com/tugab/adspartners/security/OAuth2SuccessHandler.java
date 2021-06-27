package com.tugab.adspartners.security;

import com.tugab.adspartners.domain.entities.UserInfo;
import com.tugab.adspartners.utils.CookieUtils;
import com.tugab.adspartners.utils.JwtUtils;
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

import static com.tugab.adspartners.security.OAuth2CookieRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final OAuth2CookieRequestRepository oAuth2CookieRepository;

    @Autowired
    public OAuth2SuccessHandler(JwtUtils jwtUtils,
                                OAuth2CookieRequestRepository oAuth2CookieRepository) {
        this.jwtUtils = jwtUtils;
        this.oAuth2CookieRepository = oAuth2CookieRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse(getDefaultTargetUrl());

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(redirectUri);
        UserInfo userInfo = (UserInfo) authentication.getPrincipal();

        if (userInfo.getToken() != null) {
            String token = jwtUtils.generateJwtToken(authentication);
            uriBuilder.queryParam("token", token);
        } else {
            uriBuilder.queryParam("error", "You don't provide enough permission.");
        }

        String targetUrl = uriBuilder.build().toUriString();
        super.clearAuthenticationAttributes(request);
        this.oAuth2CookieRepository.removeAuthorizationRequestCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
