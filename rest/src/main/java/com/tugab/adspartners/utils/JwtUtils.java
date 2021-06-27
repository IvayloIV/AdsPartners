package com.tugab.adspartners.utils;

import com.google.gson.Gson;
import com.tugab.adspartners.domain.entities.UserInfo;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    private final Gson gson;

    @Autowired
    public JwtUtils(Gson gson) {
        this.gson = gson;
    }

    public String generateJwtToken(Authentication authentication) {
        UserInfo userInfo = (UserInfo) authentication.getPrincipal();
        List<String> userRoles = userInfo.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        JwtBuilder jwtBuilder = Jwts.builder();
        jwtBuilder.claim("username", userInfo.getName());
        jwtBuilder.claim("roles", this.gson.toJson(userRoles));

        if (userInfo.getToken() != null) {
            jwtBuilder = jwtBuilder.claim("token", userInfo.getToken());
        }

        Date issuedAt = new Date();
        return jwtBuilder.setSubject(userInfo.getEmail())
            .setIssuedAt(issuedAt)
            .setExpiration(new Date(issuedAt.getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String getUserEmailFromJwtToken(String token) {
        return this.getJwtToken(token).getBody().getSubject();
    }

    public String getUserTokenFromJwtToken(String token) {
        return (String) this.getJwtToken(token).getBody().get("token");
    }

    public boolean validateJwtToken(String authToken) {
        try {
            this.getJwtToken(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        }

        return false;
    }

    private Jws<Claims> getJwtToken(String authToken) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
    }
}
