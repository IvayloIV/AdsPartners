package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.RatingResponse;
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
    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel,
                                                  Authentication authentication) {
        return this.adService.adsList(adFilterBindingModel, authentication);
    }

    @GetMapping("/list/company")
    public ResponseEntity<AdListResponse> adsListByCompany(AdFilterBindingModel adFilterBindingModel,
                                                           Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        adFilterBindingModel.setCompanyId(company.getId());
        adFilterBindingModel.setSize(Integer.MAX_VALUE);
        return this.adService.adsList(adFilterBindingModel, authentication);
    }

    @GetMapping("/list/company/{id}")
    public ResponseEntity<AdListResponse> adsListByCompanyId(AdFilterBindingModel adFilterBindingModel,
                                                            @PathVariable("id") Long companyId,
                                                            Authentication authentication) {
        adFilterBindingModel.setCompanyId(companyId);
        adFilterBindingModel.setSize(Integer.MAX_VALUE);
        return this.adService.adsList(adFilterBindingModel, authentication);
    }

    @GetMapping("/filters")
    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel) {
        return this.adService.getFilters(filtersBindingModel);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<AdDetailsResponse> getDetails(@PathVariable("id") Long id) {
        return this.adService.getDetails(id);
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
        return this.adService.changeAdBlockingStatus(adId, true);
    }

    @PatchMapping("/unblock/{id}")
    public ResponseEntity<?> unblockAd(@PathVariable("id") Long adId) {
        return this.adService.changeAdBlockingStatus(adId, false);
    }
}
