package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;

import java.util.List;

public interface AdService {

    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel);

    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel);

    public ResponseEntity<AdDetailsResponse> getDetails(Long adId);

    public ResponseEntity createAd(CreateAdBindingModel createAdBindingModel, Errors errors);

    public ResponseEntity<CreateRatingResponse> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber);

    public ResponseEntity<MessageResponse> subscribe(Long adId, Youtuber youtuber);

    public ResponseEntity<MessageResponse> applyFor(AdApplicationBindingModel adApplicationBindingModel);

    public ResponseEntity<List<AdApplicationResponse>> getApplications(Long adId);
}
