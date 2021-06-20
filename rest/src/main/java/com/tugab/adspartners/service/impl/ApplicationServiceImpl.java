package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.AdApplication;
import com.tugab.adspartners.domain.entities.AdApplicationId;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.application.AdApplicationBindingModel;
import com.tugab.adspartners.domain.models.response.application.AdApplicationResponse;
import com.tugab.adspartners.domain.models.response.common.ErrorResponse;
import com.tugab.adspartners.domain.models.response.common.MessageResponse;
import com.tugab.adspartners.repository.AdApplicationRepository;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.service.ApplicationService;
import com.tugab.adspartners.service.EmailService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final EmailService emailService;
    private final AdApplicationRepository adApplicationRepository;
    private final AdRepository adRepository;
    private final ResourceBundleUtil resourceBundleUtil;
    private final ModelMapper modelMapper;

    @Autowired
    public ApplicationServiceImpl(EmailService emailService,
                                  AdApplicationRepository adApplicationRepository,
                                  AdRepository adRepository,
                                  ResourceBundleUtil resourceBundleUtil,
                                  ModelMapper modelMapper) {
        this.emailService = emailService;
        this.adApplicationRepository = adApplicationRepository;
        this.adRepository = adRepository;
        this.resourceBundleUtil = resourceBundleUtil;
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
    public ResponseEntity<?> applyFor(AdApplicationBindingModel adApplicationBindingModel) {
        Ad ad = this.adRepository.findById(adApplicationBindingModel.getAdId()).orElse(null);

        if (ad == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("adDetails.wrongId");
            return new ResponseEntity<>(new ErrorResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        } else if (ad.getIsBlocked()) {
            String blockedAdMessage = this.resourceBundleUtil.getMessage("adDetails.blocked");
            return new ResponseEntity<>(new ErrorResponse(blockedAdMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (ad.getValidTo().compareTo(new Date()) < 0) {
            String expiredAdMessage = this.resourceBundleUtil.getMessage("adDetails.expired");
            return new ResponseEntity<>(new ErrorResponse(expiredAdMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Youtuber youtuber = adApplicationBindingModel.getYoutuber();
        AdApplication application = this.adApplicationRepository.findById_Youtuber_IdAndId_Ad_Id(youtuber.getId(), ad.getId());

        if (ad.getMinVideos() != null && youtuber.getVideoCount() < ad.getMinVideos()) {
            String minVideosMessage = this.resourceBundleUtil.getMessage("adDetails.minVideos");
            return new ResponseEntity<>(new ErrorResponse(minVideosMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (ad.getMinSubscribers() != null && youtuber.getSubscriberCount() < ad.getMinSubscribers()) {
            String minSubscribersMessage = this.resourceBundleUtil.getMessage("adDetails.minSubs");
            return new ResponseEntity<>(new ErrorResponse(minSubscribersMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (ad.getMinViews() != null && youtuber.getViewCount() < ad.getMinViews()) {
            String minViewsMessage = this.resourceBundleUtil.getMessage("adDetails.minViews");
            return new ResponseEntity<>(new ErrorResponse(minViewsMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (application != null) {
            String alreadyAppliedFor = this.resourceBundleUtil.getMessage("adDetails.alreadyAppliedFor");
            return new ResponseEntity<>(new ErrorResponse(alreadyAppliedFor), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        AdApplication adApplication = new AdApplication();
        adApplication.setId(new AdApplicationId(ad, youtuber));
        adApplication.setDescription(adApplicationBindingModel.getDescription());
        adApplication.setApplicationDate(new Date());

        this.adApplicationRepository.save(adApplication);
        this.emailService.sendAdApplicationNotification(adApplication);

        String applyForSuccessMessage = this.resourceBundleUtil.getMessage("adDetails.applyForSuccess");
        return ResponseEntity.ok(new MessageResponse(applyForSuccessMessage));
    }
}
