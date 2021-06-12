package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.filter.AdFiltersResponse;
import com.tugab.adspartners.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/ad")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdController {

    private final AdService adService;

    @Autowired
    private AdController(AdService adService) {
        this.adService = adService;
    }

    @GetMapping("/list")
    public ResponseEntity<AdListResponse> list(AdListFilterBindingModel adListFilterBindingModel,
                                               Authentication authentication) {
        return this.adService.getList(adListFilterBindingModel, authentication);
    }

    @GetMapping("/list/company")
    public ResponseEntity<AdListResponse> companyAds(AdListFilterBindingModel adListFilterBindingModel,
                                                     Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        adListFilterBindingModel.setCompanyId(company.getUser().getId());
        adListFilterBindingModel.setSize(Integer.MAX_VALUE);
        return this.adService.getList(adListFilterBindingModel, authentication);
    }

    @GetMapping("/list/company/{id}")
    public ResponseEntity<AdListResponse> companyAdsById(AdListFilterBindingModel adListFilterBindingModel,
                                                         @PathVariable("id") Long companyId,
                                                         Authentication authentication) {
        adListFilterBindingModel.setCompanyId(companyId);
        adListFilterBindingModel.setSize(Integer.MAX_VALUE);
        return this.adService.getList(adListFilterBindingModel, authentication);
    }

    @GetMapping("/filters")
    public ResponseEntity<AdFiltersResponse> getFilters(AdFiltersBindingModel adFiltersBindingModel) {
        return this.adService.getFilters(adFiltersBindingModel);
    }

    @GetMapping("/details/{adId}")
    public ResponseEntity<?> getDetails(@PathVariable Long adId,
                                        Authentication authentication) {
        return this.adService.getDetails(adId, authentication);
    }

    @PostMapping(path = "/create")
    public ResponseEntity<?> createAd(@Valid @RequestBody CreateAdBindingModel createAdBindingModel,
                                    Errors errors,
                                    Authentication authentication) {
        createAdBindingModel.setCompany((Company) authentication.getPrincipal());
        return this.adService.createAd(createAdBindingModel, errors);
    }

    @PutMapping(path = "/edit/{id}")
    public ResponseEntity<?> editAd(@PathVariable("id") Long adId,
                                      @Valid @RequestBody EditAdBindingModel editAdBindingModel,
                                      Errors errors,
                                      Authentication authentication) {
        editAdBindingModel.setId(adId);
        editAdBindingModel.setCompany((Company) authentication.getPrincipal());
        return this.adService.editAd(editAdBindingModel, errors);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<?> deleteAd(@PathVariable("id") Long adId,
                                      Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.adService.deleteAd(adId, company);
    }

    @PostMapping(path = "/vote/{adId}")
    public ResponseEntity<?> vote(@PathVariable Long adId,
                                  @RequestBody RatingBindingModel ratingBindingModel,
                                  Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.adService.vote(adId, ratingBindingModel, youtuber);
    }

    @PatchMapping("/block/{id}")
    public ResponseEntity<?> blockAd(@PathVariable("id") Long adId) {
        return this.adService.updateAdBlockingStatus(adId, true);
    }

    @PatchMapping("/unblock/{id}")
    public ResponseEntity<?> unblockAd(@PathVariable("id") Long adId) {
        return this.adService.updateAdBlockingStatus(adId, false);
    }
}
