package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.AdRating;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.CreateAdBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.RatingBindingModel;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;

import java.util.List;

public interface AdService {

    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel);

    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel);

    public ResponseEntity createAd(CreateAdBindingModel createAdBindingModel, Errors errors);

    public ResponseEntity<CreateRatingResponse> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber);
}
