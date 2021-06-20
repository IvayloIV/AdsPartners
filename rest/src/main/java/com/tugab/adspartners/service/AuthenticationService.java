package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.enums.Authority;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.Errors;

public interface AuthenticationService extends UserDetailsService {

    public ResponseEntity<?> authenticateUser(String username, String password, Errors errors,
                                               String badCredentialsKey, Authority requiredAuthority);
}
