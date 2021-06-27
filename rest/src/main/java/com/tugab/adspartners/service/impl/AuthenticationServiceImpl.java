package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.domain.models.response.common.ErrorResponse;
import com.tugab.adspartners.domain.models.response.common.JwtResponse;
import com.tugab.adspartners.repository.CompanyRepository;
import com.tugab.adspartners.repository.UserRepository;
import com.tugab.adspartners.utils.JwtUtils;
import com.tugab.adspartners.service.AuthenticationService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JwtUtils jwtUtils;
    private final ResourceBundleUtil resourceBundleUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationServiceImpl(UserRepository userRepository,
                       CompanyRepository companyRepository,
                       JwtUtils jwtUtils,
                       ResourceBundleUtil resourceBundleUtil,
                 @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jwtUtils = jwtUtils;
        this.resourceBundleUtil = resourceBundleUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return this.userRepository.findByEmail(email)
            .orElseThrow(() -> {
                String userNotFoundMessage = this.resourceBundleUtil.getMessage("user.notFound");
                return new UsernameNotFoundException(userNotFoundMessage);
            });
    }

    @Override
    public ResponseEntity<?> authenticateUser(String username, String password, Errors errors, String badCredentialsKey, Authority requiredAuthority) {
        if (errors.hasErrors()) {
            List<String> errorMessages = errors.getAllErrors()
                    .stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new ErrorResponse(errorMessages), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Authentication authentication;
        String badCredentialsMessage = this.resourceBundleUtil.getMessage(badCredentialsKey);

        try {
            authentication = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            if (authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals(requiredAuthority.name()))) {
                throw new BadCredentialsException(badCredentialsMessage);
            }
        } catch (BadCredentialsException ex) {
            return new ResponseEntity<>(new ErrorResponse(badCredentialsMessage), HttpStatus.UNAUTHORIZED);
        }

        if (requiredAuthority.equals(Authority.EMPLOYER)) {
            Company company = this.companyRepository.findByUserEmail(username).orElse(null);

            if (company != null && !RegistrationStatus.ALLOWED.equals(company.getStatus())) {
                String badCompanyStatusMessage = this.resourceBundleUtil.getMessage("companyLogin.badCompanyStatus");
                return new ResponseEntity<>(new ErrorResponse(badCompanyStatusMessage), HttpStatus.UNAUTHORIZED);
            }
        }

        String jwt = this.jwtUtils.generateJwtToken(authentication);
        return ResponseEntity.ok(new JwtResponse(jwt));
    }
}
