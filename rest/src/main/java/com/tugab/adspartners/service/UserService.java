package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel);

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel);

    public User findByEmail(String email);

    public Company findCompanyByEmail(String email);

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginCompanyBindingModel);

    public ResponseEntity<List<CompanyListResponse>> getCompanyList();

    public ResponseEntity<CompanyResponse> getCompanyById(Long id);
}
