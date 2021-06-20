package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.models.binding.admin.LoginAdminBindingModel;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;

public interface AdminService {

    public ResponseEntity<?> login(LoginAdminBindingModel loginCompanyBindingModel, Errors errors);
}
