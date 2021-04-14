package com.tugab.adspartners.config;

import com.tugab.adspartners.security.HttpCookieOAuth2AuthorizationRequestRepository;
import com.tugab.adspartners.security.OAuth2AuthenticationSuccessHandler;
import com.tugab.adspartners.security.jwt.AuthEntryPointJwt;
import com.tugab.adspartners.security.jwt.AuthTokenFilter;
import com.tugab.adspartners.service.UserService;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
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
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final AuthEntryPointJwt unauthorizedHandler;
    private final YoutubeService youtubeService;
    private final AuthTokenFilter authTokenFilter;

    @Autowired
    private UserService userService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    public SecurityConfig(AuthEntryPointJwt unauthorizedHandler,
                          YoutubeService youtubeService,
                          AuthTokenFilter authTokenFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.youtubeService = youtubeService;
        this.authTokenFilter = authTokenFilter;
    }

    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //TODO: should i hash my password instead encode it?
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
                .antMatchers("/company/**", "/company/register", "/company/login", "/api/test/**", "/admin/login", "/ad/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .oauth2Login()
                .authorizationEndpoint()
                .authorizationRequestRepository(this.httpCookieOAuth2AuthorizationRequestRepository())
            .and()
                .userInfoEndpoint()
                .userService(this.youtubeService)
            .and()
                .successHandler(oAuth2AuthenticationSuccessHandler)
            .and()
                .exceptionHandling()
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .and()
                .logout().logoutUrl("/logout").logoutSuccessUrl("/"); //TODO: logout...

        http.addFilterBefore(this.authTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
