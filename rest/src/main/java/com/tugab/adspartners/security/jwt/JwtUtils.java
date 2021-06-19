package com.tugab.adspartners.security.jwt;

import com.google.gson.Gson;
import com.tugab.adspartners.domain.entities.UserInfo;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.app.secret}")
    private String jwtSecret;

    @Value("${jwt.app.expidationMs}")
    private int jwtExpirationMs;

    @Autowired
    private Gson gson;

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

        return jwtBuilder.setSubject(userInfo.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String getUserEmailFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public String getUserTokenFromJwtToken(String token) {
        return (String) Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().get("token");
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
