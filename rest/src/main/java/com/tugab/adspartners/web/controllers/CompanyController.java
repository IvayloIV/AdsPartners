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
import com.tugab.adspartners.service.CompanyService;
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

    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterCompanyBindingModel registerCompanyBindingModel,
                                      Errors errors) {
        return this.companyService.register(registerCompanyBindingModel, errors);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginCompanyBindingModel loginCompanyBindingModel,
                                   Errors errors) {
        return this.companyService.login(loginCompanyBindingModel, errors);
    }

    @GetMapping("/list")
    public ResponseEntity<CompanyAdsListResponse> list(CompanyFiltersBindingModel companyFiltersBindingModel) {
        return this.companyService.getList(companyFiltersBindingModel);
    }

    @GetMapping(path = "/list/rating")
    public ResponseEntity<List<CompanyInfoResponse>> companiesByRating(@RequestParam("size") Integer size) {
        return this.companyService.getListByRating(size);
    }

    @GetMapping("/filters")
    public ResponseEntity<CompanyFiltersResponse> companiesFilters() {
        return this.companyService.getFilters();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.companyService.getById(company.getUser().getId());
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> details(@PathVariable Long id) {
        return this.companyService.getById(id);
    }

    @GetMapping(path = "/register/requests")
    public ResponseEntity<List<CompanyRegisterRequestResponse>> registerRequests() {
        return this.companyService.getRegisterRequests();
    }

    @GetMapping(path = "/register/history")
    public ResponseEntity<List<CompanyRegisterHistoryResponse>> registerHistory() {
        return this.companyService.getRegisterHistory();
    }

    @PatchMapping(path = "/register/status/{companyId}")
    public ResponseEntity<?> updateRegisterStatus(@PathVariable Long companyId,
                                                   @RequestBody UpdateStatusBindingModel updateStatusBindingModel) {
        return this.companyService.updateStatus(companyId, updateStatusBindingModel);
    }
}
