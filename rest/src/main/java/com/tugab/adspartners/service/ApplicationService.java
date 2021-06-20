package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.models.binding.application.AdApplicationBindingModel;
import com.tugab.adspartners.domain.models.response.application.AdApplicationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ApplicationService {

    public ResponseEntity<List<AdApplicationResponse>> getByAdId(Long adId);

    public ResponseEntity<List<AdApplicationResponse>> getList(Long youtuberId, Long companyId);

    public ResponseEntity<?> applyFor(AdApplicationBindingModel adApplicationBindingModel);
}
