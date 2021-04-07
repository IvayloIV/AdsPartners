package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.CloudinaryResource;
import com.tugab.adspartners.domain.models.binding.Ad.CreateAdBindingModel;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.service.AdService;
import com.tugab.adspartners.service.CloudinaryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

import java.util.Date;

@Service
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;

    @Autowired
    public AdServiceImpl(AdRepository adRepository,
                         CloudinaryService cloudinaryService,
                         ModelMapper modelMapper) {
        this.adRepository = adRepository;
        this.modelMapper = modelMapper;
        this.cloudinaryService = cloudinaryService;
    }

    public ResponseEntity createAd(CreateAdBindingModel createAdBindingModel, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(errors.getFieldErrors());
        }

        CloudinaryResource picture = this.cloudinaryService.uploadImage(createAdBindingModel.getPictureBase64());

        Ad ad = this.modelMapper.map(createAdBindingModel, Ad.class);
        ad.setCreationDate(new Date());
        ad.setPicture(picture);
        ad.setIsBlocked(false);
        ad.getCharacteristics().forEach(c -> c.setAd(ad));
        this.adRepository.save(ad);
        return new ResponseEntity(ad, HttpStatus.CREATED);
    }
}
