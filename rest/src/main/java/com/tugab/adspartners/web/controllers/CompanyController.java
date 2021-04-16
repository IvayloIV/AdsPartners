package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import com.tugab.adspartners.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> registerCompany(@ModelAttribute RegisterCompanyBindingModel registerCompanyBindingModel) {
        return this.userService.registerCompany(registerCompanyBindingModel);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCompany(@RequestBody LoginCompanyBindingModel loginCompanyBindingModel) {
        return this.userService.loginCompany(loginCompanyBindingModel);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CompanyListResponse>> getCompanies() {
        return this.userService.getCompanyList();
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<CompanyResponse> getCompany(@PathVariable("id") Long id) {
        return this.userService.getCompanyById(id);
    }

    @GetMapping("/subscribers/{id}")
    public ResponseEntity<List<SubscriptionInfoResponse>> getSubscribers(Authentication authentication,
                                                                         @PathVariable("id") Long adId) {
        Company company = (Company) authentication.getPrincipal();
        return this.userService.getCompanySubscribers(company, adId);
    }
}
