package com.tugab.adspartners.service.impl;

import com.nimbusds.jwt.util.DateUtils;
import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.CreateAdBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.RatingBindingModel;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import com.tugab.adspartners.repository.AdRatingRepository;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.service.AdService;
import com.tugab.adspartners.service.CloudinaryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.OptionalDouble;
import java.util.stream.Collectors;

@Service
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final AdRatingRepository adRatingRepository;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;

    @Autowired
    public AdServiceImpl(AdRepository adRepository,
                         AdRatingRepository adRatingRepository,
                         CloudinaryService cloudinaryService,
                         ModelMapper modelMapper) {
        this.adRepository = adRepository;
        this.adRatingRepository = adRatingRepository;
        this.modelMapper = modelMapper;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel) {
        Pageable pageable = PageRequest.of(adFilterBindingModel.getPage() - 1, adFilterBindingModel.getSize());
        Page<Ad> pageAds = this.adRepository.findAll(adFilterBindingModel, pageable);

        List<AdResponse> adsResponse = pageAds.getContent().stream()
                .map(this::setAdsCountToCompany)
                .map(this::setAdAverageRating)
                .map(a -> this.modelMapper.map(a, AdResponse.class))
                .collect(Collectors.toList());

        AdListResponse adListResponse = new AdListResponse();
        adListResponse.setItems(adsResponse);
        adListResponse.setElementsPerPage(pageAds.getSize());
        adListResponse.setTotalPages(pageAds.getTotalPages());
        adListResponse.setTotalElements(pageAds.getTotalElements());

        return ResponseEntity.ok(adListResponse);
    }

    private Ad setAdsCountToCompany(Ad ad) {
        Integer adsCount = ad.getCompany().getAds().size();
        ad.getCompany().setAdsCount(adsCount);
        return ad;
    }

    private Ad setAdAverageRating(Ad ad) {
        ad.getRatingList()
            .stream()
            .mapToInt(AdRating::getRating)
            .average()
            .ifPresent(ad::setAverageRating);

        return ad;
    }

    @Override
    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel) {
        final SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy");

        List<Ad> ads = this.adRepository.findAllByFilters(filtersBindingModel);
        FiltersResponse filtersResponse = new FiltersResponse();

        for (Ad ad : ads) {
            filtersResponse.getRewards().add(ad.getReward());
            try {
                filtersResponse.getCreatedDates().add(formater.parse(formater.format(ad.getCreationDate())));
                filtersResponse.getValidToDates().add(formater.parse(formater.format(ad.getValidTo())));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            filtersResponse.getMinVideos().add(ad.getMinVideos());
            filtersResponse.getMinSubscribers().add(ad.getMinSubscribers());
            filtersResponse.getMinViews().add(ad.getMinViews());
        }

        return ResponseEntity.ok(filtersResponse);
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

    public ResponseEntity<CreateRatingResponse> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber) {
        Ad ad = this.adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect ad id."));
        AdRating adRating = new AdRating();
        adRating.setId(new AdRatingId(ad, youtuber));
        adRating.setRating(ratingBindingModel.getRating());
        adRating.setCreationDate(new Date());
        this.adRatingRepository.save(adRating);

        CreateRatingResponse rating = this.modelMapper.map(adRating, CreateRatingResponse.class);
        rating.setAdId(ad.getId());
        rating.setYoutubeId(youtuber.getId());
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }
}
