package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.models.binding.ad.AdApplicationBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ApplicationService {

    public ResponseEntity<List<AdApplicationResponse>> getByAdId(Long adId);

    public ResponseEntity<List<AdApplicationResponse>> getList(Long youtuberId, Long companyId);

    public ResponseEntity<MessageResponse> applyFor(AdApplicationBindingModel adApplicationBindingModel);

//    public ResponseEntity<List<AdYoutuberApplicationResponse>> getApplicationsByYoutuberId(Long youtuberId);
}
