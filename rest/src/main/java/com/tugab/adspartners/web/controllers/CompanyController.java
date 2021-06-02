package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyOfferBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.company.*;
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
    public ResponseEntity<?> registerCompany(@Valid @RequestBody RegisterCompanyBindingModel registerCompanyBindingModel,
                                             Errors errors) {
        return this.userService.registerCompany(registerCompanyBindingModel, errors);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginCompany(@Valid @RequestBody LoginCompanyBindingModel loginCompanyBindingModel,
                                          Errors errors) {
        return this.userService.loginCompany(loginCompanyBindingModel, errors);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CompanyListResponse>> getCompanies() {
        return this.userService.getCompanyList();
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<CompanyResponse> getCompany(@PathVariable("id") Long id) {
        return this.userService.getCompanyById(id);
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyResponse> getProfile(Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.userService.getCompanyById(company.getId());
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<SubscriptionInfoResponse>> getSubscribers(Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.userService.getCompanySubscribers(company);
    }

    @PostMapping("/subscriber/{id}/status")
    public ResponseEntity<MessageResponse> subscriberStatus(@RequestBody SubscriberStatusBindingModel subscriberStatusBindingModel,
                                                            @PathVariable("id") Long youtuberId,
                                                            Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        subscriberStatusBindingModel.setCompanyId(company.getId());
        subscriberStatusBindingModel.setYoutuberId(youtuberId);
        return this.userService.changeSubscriberStatus(subscriberStatusBindingModel);
    }

    @PostMapping(path = "/subscribe/{id}")
    public ResponseEntity<MessageResponse> subscribe(@PathVariable("id") Long companyId,
                                                     Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.userService.subscribe(youtuber, companyId);
    }

    @PostMapping(path = "/{id}/unsubscribe")
    public ResponseEntity<?> unsubscribe(@PathVariable("id") Long companyId,
                                                       Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.userService.unsubscribe(youtuber, companyId);
    }

    @GetMapping(path = "/subscription/check/{id}")
    public ResponseEntity<Boolean> checkYoutuberSub(@PathVariable("id") Long companyId,
                                                    Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.userService.checkSubscription(youtuber.getId(), companyId);
    }

    @GetMapping(path = "/register/requests")
    public ResponseEntity<List<CompanyRegisterRequestResponse>> registerRequests() {
        return this.userService.getRegisterRequests();
    }

    @GetMapping(path = "/register/history")
    public ResponseEntity<List<CompanyRegisterHistoryResponse>> registerHistory() {
        return this.userService.getRegisterHistory();
    }

    @PostMapping(path = "/register/status/{id}")
    public ResponseEntity<CompanyRegisterHistoryResponse> updateRegisterStatus(@PathVariable("id") Long companyId,
                                                                @RequestBody UpdateStatusBindingModel updateStatusBindingModel) {
        return this.userService.updateCompanyStatus(companyId, updateStatusBindingModel);
    }

    @GetMapping(path = "/list/rating")
    public ResponseEntity<List<CompanyInfoResponse>> getCompanyList(@RequestParam("size") Integer size) {
        return this.userService.getCompanyList(size);
    }

    @GetMapping("/list/ad")
    public ResponseEntity<CompanyAdsListResponse> getCompaniesAds(CompanyFilterBindingModel companyFilterBindingModel) {
        return this.userService.getCompaniesAds(companyFilterBindingModel);
    }

    @GetMapping("/filters")
    public ResponseEntity<CompanyFiltersResponse> getCompaniesFilters() {
        return this.userService.getCompaniesFilters();
    }

    @PostMapping(path = "/offer")
    public ResponseEntity<MessageResponse> partnershipOffer(@RequestBody CompanyOfferBindingModel companyOfferBindingModel,
                                                            Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.userService.companyOffer(companyOfferBindingModel, company);
    }
}
