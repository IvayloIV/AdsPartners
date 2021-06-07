package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.Errors;

import java.util.Collection;

public interface AdService {

    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel, Collection<? extends GrantedAuthority> authorities);

    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel);

    public ResponseEntity<AdDetailsResponse> getDetails(Long adId);

    public ResponseEntity<?> createAd(CreateAdBindingModel createAdBindingModel, Errors errors);

    public ResponseEntity<?> editAd(EditAdBindingModel editAdBindingModel, Errors errors);

    public ResponseEntity<?> deleteAd(Long adId, Company company);

    public ResponseEntity<CreateRatingResponse> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber);

    public ResponseEntity<?> changeAdBlockingStatus(Long adId, Boolean isBlocked);

    public Ad setAdAverageRating(Ad ad);
}
