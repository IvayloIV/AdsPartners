package com.tugab.adspartners.config;

import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.security.OAuth2CookieRequestRepository;
import com.tugab.adspartners.security.OAuth2FailureHandler;
import com.tugab.adspartners.security.OAuth2SuccessHandler;
import com.tugab.adspartners.security.AuthTokenFilter;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final AuthTokenFilter authTokenFilter;
    private final YoutubeService youtubeService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    @Autowired
    public SecurityConfig(AuthTokenFilter authTokenFilter,
                          YoutubeService youtubeService,
                    @Lazy OAuth2SuccessHandler oAuth2SuccessHandler,
                    @Lazy OAuth2FailureHandler oAuth2FailureHandler) {
        this.authTokenFilter = authTokenFilter;
        this.youtubeService = youtubeService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
    }

    @Bean
    public OAuth2CookieRequestRepository oAuth2CookieRepository() {
        return new OAuth2CookieRequestRepository();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(this.authTokenFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeRequests()
                .antMatchers("/youtube/list", "/admin/login", "/company/register", "/company/login", "/company/list/rating")
                    .permitAll()
                .antMatchers("/ad/block/*", "/ad/unblock/*", "/company/list", "/company/filters",
                        "/company/register/requests", "/company/register/history", "/company/register/status/*")
                    .hasAuthority(Authority.ADMIN.name())
                .antMatchers("/ad/list", "/ad/filters", "/ad/vote/*", "/youtube/profile", "/youtube/profile/update", "/application/company/*",
                        "/application/applyfor/*", "/subscription/subscribe/*", "/subscription/unsubscribe/*", "/subscription/check/*")
                    .hasAuthority(Authority.YOUTUBER.name())
                .antMatchers("/ad/list/company", "/ad/create", "/ad/edit/*", "/ad/delete/*",
                        "/application/youtuber/*", "/company/profile", "/subscription/list", "/subscription")
                    .hasAuthority(Authority.EMPLOYER.name())
                .antMatchers("/youtube/details/*", "/application/ad/*")
                    .hasAnyAuthority(Authority.ADMIN.name(), Authority.EMPLOYER.name())
                .antMatchers("/company/details/*")
                    .hasAnyAuthority(Authority.ADMIN.name(), Authority.YOUTUBER.name())
                .anyRequest()
                    .authenticated()
            .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
                .oauth2Login()
                    .authorizationEndpoint()
                    .authorizationRequestRepository(this.oAuth2CookieRepository())
                .and()
                    .userInfoEndpoint()
                    .userService(this.youtubeService)
                .and()
                    .successHandler(oAuth2SuccessHandler)
                    .failureHandler(oAuth2FailureHandler)
            .and()
                .cors()
            .and()
                .csrf()
                    .disable();
    }
}
