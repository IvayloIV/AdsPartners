package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.entities.UserInfo;
import com.tugab.adspartners.domain.models.binding.Ad.CreateAdBindingModel;
import com.tugab.adspartners.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
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

    @PostMapping(path = "/create")
    public ResponseEntity createAd(@Valid @RequestBody CreateAdBindingModel createAdBindingModel,
                                    Errors errors,
                                    Authentication authentication) {
        createAdBindingModel.setCompany((User) authentication.getPrincipal());
        return this.adService.createAd(createAdBindingModel, errors);
    }
}
