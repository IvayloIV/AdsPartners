package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.application.AdApplicationBindingModel;
import com.tugab.adspartners.domain.models.response.application.AdApplicationResponse;
import com.tugab.adspartners.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/application")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/ad/{adId}")
    public ResponseEntity<List<AdApplicationResponse>> getByAd(@PathVariable Long adId) {
        return this.applicationService.getByAdId(adId);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<AdApplicationResponse>> getByCompany(@PathVariable Long companyId,
                                                                    Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.applicationService.getList(youtuber.getId(), companyId);
    }

    @GetMapping("/youtuber/{youtuberId}")
    public ResponseEntity<List<AdApplicationResponse>> getByYoutuber(@PathVariable Long youtuberId,
                                                                     Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.applicationService.getList(youtuberId, company.getUser().getId());
    }

    @PostMapping(path = "/applyfor/{adId}")
    public ResponseEntity<?> applyFor(@PathVariable Long adId,
                                      @RequestBody AdApplicationBindingModel adApplicationBindingModel,
                                      Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        adApplicationBindingModel.setAdId(adId);
        adApplicationBindingModel.setYoutuber(youtuber);
        return this.applicationService.applyFor(adApplicationBindingModel);
    }
}
