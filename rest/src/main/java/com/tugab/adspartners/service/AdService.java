package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;

public interface AdService {

    public ResponseEntity<AdListResponse> getList(AdFilterBindingModel adFilterBindingModel, Authentication authentication);

    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel);

    public ResponseEntity<?> getDetails(Long adId, Authentication authentication);

    public ResponseEntity<?> createAd(CreateAdBindingModel createAdBindingModel, Errors errors);

    public ResponseEntity<?> editAd(EditAdBindingModel editAdBindingModel, Errors errors);

    public ResponseEntity<?> deleteAd(Long adId, Company company);

    public ResponseEntity<?> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber);

    public ResponseEntity<?> updateAdBlockingStatus(Long adId, Boolean isBlocked);

    public Ad setAdAverageRating(Ad ad);
}
