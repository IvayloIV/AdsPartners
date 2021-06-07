package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.AdApplication;
import com.tugab.adspartners.domain.entities.AdApplicationId;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.enums.ApplicationType;
import com.tugab.adspartners.domain.models.binding.ad.AdApplicationBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import com.tugab.adspartners.repository.AdApplicationRepository;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.service.ApplicationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final AdApplicationRepository adApplicationRepository;
    private final AdRepository adRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ApplicationServiceImpl(AdApplicationRepository adApplicationRepository,
                                  AdRepository adRepository,
                                  ModelMapper modelMapper) {
        this.adApplicationRepository = adApplicationRepository;
        this.adRepository = adRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResponseEntity<List<AdApplicationResponse>> getByAdId(Long adId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Ad_Id(adId);

        List<AdApplicationResponse> adApplicationResponses = applications
                .stream()
                .map(a -> this.modelMapper.map(a, AdApplicationResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(adApplicationResponses);
    }

    @Override
    public ResponseEntity<List<AdApplicationResponse>> getList(Long youtuberId, Long companyId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Youtuber_IdAndId_Ad_Company_Id(youtuberId, companyId);

        List<AdApplicationResponse> adApplicationResponses = applications
                .stream()
                .map(a -> this.modelMapper.map(a, AdApplicationResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(adApplicationResponses);
    }

    @Override
    public ResponseEntity<MessageResponse> applyFor(AdApplicationBindingModel adApplicationBindingModel) {
        Ad ad = this.adRepository.findById(adApplicationBindingModel.getAdId())
                .orElseThrow(() -> new IllegalArgumentException("Ad id does not exist."));
        Youtuber youtuber = adApplicationBindingModel.getYoutuber();

        AdApplication adApplication = new AdApplication();
        adApplication.setId(new AdApplicationId(ad, youtuber));
        adApplication.setDescription(adApplicationBindingModel.getDescription());
        adApplication.setApplicationDate(new Date());
        adApplication.setMailSent(false); //TODO: send mail here
        adApplication.setType(ApplicationType.YOUTUBER_SENT);

        this.adApplicationRepository.save(adApplication);
        return ResponseEntity.ok(new MessageResponse("You have just applied for ad."));
    }

//    @Override
//    public ResponseEntity<List<AdYoutuberApplicationResponse>> getApplicationsByYoutuberId(Long youtuberId) {
//        List<AdApplication> applications = this.adApplicationRepository.findById_Youtuber_Id(youtuberId);
//        List<AdYoutuberApplicationResponse> adsResponse = applications
//                .stream()
//                .map(a -> {
//                    AdYoutuberApplicationResponse adApplication =
//                            this.modelMapper.map(a.getId().getAd(), AdYoutuberApplicationResponse.class);
//                    adApplication.setType(a.getType().name());
//                    return adApplication;
//                }) //TODO: not the best way for AdYoutuberApplicationResponse
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(adsResponse);
//    }
}
