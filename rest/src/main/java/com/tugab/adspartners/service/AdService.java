package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.Ad.CreateAdBindingModel;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;

public interface AdService {

    public ResponseEntity createAd(CreateAdBindingModel createAdBindingModel, Errors errors);
}
