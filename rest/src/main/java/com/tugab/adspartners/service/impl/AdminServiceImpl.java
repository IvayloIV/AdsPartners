package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.models.binding.admin.LoginAdminBindingModel;
import com.tugab.adspartners.service.AdminService;
import com.tugab.adspartners.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

@Service
public class AdminServiceImpl implements AdminService {

    private final AuthenticationService authenticationService;

    @Autowired
    public AdminServiceImpl(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public ResponseEntity<?> login(LoginAdminBindingModel loginAdminBindingModel, Errors errors) {
        String adminEmail = loginAdminBindingModel.getEmail();
        String adminPassword = loginAdminBindingModel.getPassword();
        String badCredentialsKey = "adminLogin.badCredentials";

        return this.authenticationService.authenticateUser(adminEmail, adminPassword,
            errors, badCredentialsKey, Authority.ADMIN);
    }
}
