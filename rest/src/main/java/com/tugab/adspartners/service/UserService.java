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

public interface UserService extends UserDetailsService {

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel, Errors errors);

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel, Errors errors);

    public User findByEmail(String email);

    public Company findCompanyByEmail(String email);

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginCompanyBindingModel, Errors errors);

    public ResponseEntity<?> getCompanyById(Long id);

    public ResponseEntity<List<CompanyRegisterRequestResponse>> getRegisterRequests();

    public ResponseEntity<List<CompanyRegisterHistoryResponse>> getRegisterHistory();

    public ResponseEntity<?> updateCompanyStatus(Long companyId, UpdateStatusBindingModel updateStatusBindingModel);

    public ResponseEntity<List<CompanyInfoResponse>> getCompaniesByRating(Integer size);

    public ResponseEntity<CompanyAdsListResponse> getList(CompanyFiltersBindingModel companyFiltersBindingModel);

    public ResponseEntity<CompanyFiltersResponse> getCompaniesFilters();
}
