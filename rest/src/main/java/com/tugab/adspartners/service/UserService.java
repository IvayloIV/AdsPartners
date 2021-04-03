package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel);

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel);

    public User findByEmail(String email);

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginCompanyBindingModel);
}
