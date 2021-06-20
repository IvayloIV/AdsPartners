package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.models.binding.admin.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.company.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFiltersBindingModel;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.company.filter.CompanyFiltersResponse;
import com.tugab.adspartners.domain.models.response.company.list.CompanyAdsListResponse;
import com.tugab.adspartners.domain.models.response.company.list.CompanyInfoResponse;
import com.tugab.adspartners.domain.models.response.company.register.CompanyRegisterHistoryResponse;
import com.tugab.adspartners.domain.models.response.company.register.CompanyRegisterRequestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.Errors;

import java.util.List;

public interface CompanyService {

    public ResponseEntity<?> register(RegisterCompanyBindingModel registerCompanyBindingModel, Errors errors);

    public ResponseEntity<?> login(LoginCompanyBindingModel loginCompanyBindingModel, Errors errors);

    public ResponseEntity<CompanyAdsListResponse> getList(CompanyFiltersBindingModel companyFiltersBindingModel);

    public ResponseEntity<List<CompanyInfoResponse>> getListByRating(Integer size);

    public ResponseEntity<CompanyFiltersResponse> getFilters();

    public ResponseEntity<?> getById(Long id);

    public ResponseEntity<List<CompanyRegisterRequestResponse>> getRegisterRequests();

    public ResponseEntity<List<CompanyRegisterHistoryResponse>> getRegisterHistory();

    public ResponseEntity<?> updateStatus(Long companyId, UpdateStatusBindingModel updateStatusBindingModel);

    public Company findByEmail(String email);
}
