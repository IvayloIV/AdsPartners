package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import com.tugab.adspartners.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

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
    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel) {
        return this.adService.adsList(adFilterBindingModel);
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
    public ResponseEntity createAd(@Valid @RequestBody CreateAdBindingModel createAdBindingModel,
                                    Errors errors,
                                    Authentication authentication) {
        createAdBindingModel.setCompany((Company) authentication.getPrincipal());
        return this.adService.createAd(createAdBindingModel, errors);
    }

    @PostMapping(path = "/vote/{id}")
    public ResponseEntity<CreateRatingResponse> vote(@PathVariable("id") Long adId,
                                                     @RequestBody RatingBindingModel ratingBindingModel,
                                                     Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.adService.vote(adId, ratingBindingModel, youtuber);
    }

    @PostMapping(path = "/applyfor/{id}")
    public ResponseEntity<MessageResponse> applyFor(@PathVariable("id") Long adId,
                                                     @RequestBody AdApplicationBindingModel adApplicationBindingModel,
                                                     Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        adApplicationBindingModel.setAdId(adId);
        adApplicationBindingModel.setYoutuber(youtuber);
        return this.adService.applyFor(adApplicationBindingModel);
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<List<AdApplicationResponse>> getApplications(@PathVariable("id") Long adId) {
        return this.adService.getApplications(adId);
    }
}
