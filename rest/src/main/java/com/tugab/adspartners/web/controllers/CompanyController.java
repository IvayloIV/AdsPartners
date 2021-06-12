package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.models.binding.company.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFiltersBindingModel;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.company.filter.CompanyFiltersResponse;
import com.tugab.adspartners.domain.models.response.company.list.CompanyAdsListResponse;
import com.tugab.adspartners.domain.models.response.company.list.CompanyInfoResponse;
import com.tugab.adspartners.domain.models.response.company.register.CompanyRegisterHistoryResponse;
import com.tugab.adspartners.domain.models.response.company.register.CompanyRegisterRequestResponse;
import com.tugab.adspartners.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/company")
public class CompanyController {

    private final UserService userService;

    @Autowired
    public CompanyController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterCompanyBindingModel registerCompanyBindingModel,
                                      Errors errors) {
        return this.userService.registerCompany(registerCompanyBindingModel, errors);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginCompanyBindingModel loginCompanyBindingModel,
                                   Errors errors) {
        return this.userService.loginCompany(loginCompanyBindingModel, errors);
    }

    @GetMapping("/list")
    public ResponseEntity<CompanyAdsListResponse> list(CompanyFiltersBindingModel companyFiltersBindingModel) {
        return this.userService.getList(companyFiltersBindingModel);
    }

    @GetMapping(path = "/list/rating")
    public ResponseEntity<List<CompanyInfoResponse>> companiesByRating(@RequestParam("size") Integer size) {
        return this.userService.getCompaniesByRating(size);
    }

    @GetMapping("/filters")
    public ResponseEntity<CompanyFiltersResponse> companiesFilters() {
        return this.userService.getCompaniesFilters();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.userService.getCompanyById(company.getUser().getId());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> details(@PathVariable Long id) {
        return this.userService.getCompanyById(id);
    }

    @GetMapping(path = "/register/requests")
    public ResponseEntity<List<CompanyRegisterRequestResponse>> registerRequests() {
        return this.userService.getRegisterRequests();
    }

    @GetMapping(path = "/register/history")
    public ResponseEntity<List<CompanyRegisterHistoryResponse>> registerHistory() {
        return this.userService.getRegisterHistory();
    }

    @PatchMapping(path = "/register/status/{companyId}")
    public ResponseEntity<?> updateRegisterStatus(@PathVariable Long companyId,
                                                   @RequestBody UpdateStatusBindingModel updateStatusBindingModel) {
        return this.userService.updateCompanyStatus(companyId, updateStatusBindingModel);
    }
}
