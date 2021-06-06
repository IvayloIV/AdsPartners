package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Subscription;
import com.tugab.adspartners.domain.entities.SubscriptionId;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.MessagesResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.repository.CompanyRepository;
import com.tugab.adspartners.repository.SubscriptionRepository;
import com.tugab.adspartners.service.SubscriptionService;
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
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final ResourceBundleUtil resourceBundleUtil;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository,
                                   CompanyRepository companyRepository,
                                   ModelMapper modelMapper,
                                   ResourceBundleUtil resourceBundleUtil) {
        this.subscriptionRepository = subscriptionRepository;
        this.companyRepository = companyRepository;
        this.modelMapper = modelMapper;
        this.resourceBundleUtil = resourceBundleUtil;
    }

    @Override
    public ResponseEntity<List<SubscriptionInfoResponse>> getList(Company company) {
        List<Subscription> subscriptions = this.subscriptionRepository.findById_Company(company);

        List<SubscriptionInfoResponse> subscriptionInfoResponses = subscriptions
                .stream()
                .map(s -> this.modelMapper.map(s, SubscriptionInfoResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(subscriptionInfoResponses);
    }

    @Override
    public ResponseEntity<?> subscribe(Youtuber youtuber, Long companyId) {
        Company company = this.companyRepository.findById(companyId).orElseThrow(null);
        if (company == null) {
            String wrongCompanyId = this.resourceBundleUtil.getMessage("companyProfile.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongCompanyId), HttpStatus.NOT_FOUND);
        }

        Boolean isSubscriber = this.subscriptionRepository.existsById_Company_IdAndId_Youtuber_Id(companyId, youtuber.getId());
        if (isSubscriber) {
            String alreadySubscriberMessage = this.resourceBundleUtil.getMessage("companyProfile.alreadySubscriber");
            return new ResponseEntity<>(new MessagesResponse(alreadySubscriberMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Subscription subscription = new Subscription();
        subscription.setId(new SubscriptionId(company, youtuber));
        subscription.setSubscriptionDate(new Date());
        subscription.setIsBlocked(false);

        this.subscriptionRepository.save(subscription);
        String successSubMessage = this.resourceBundleUtil.getMessage("companyProfile.subscribedSuccess");
        return ResponseEntity.ok(new MessageResponse(successSubMessage));
    }

    @Override
    public ResponseEntity<?> updateStatus(SubscriberStatusBindingModel subscriberStatusBindingModel) {
        Long companyId = subscriberStatusBindingModel.getCompanyId();
        Long youtuberId = subscriberStatusBindingModel.getYoutuberId();

        Subscription subscription = this.subscriptionRepository.findById_Company_IdAndId_Youtuber_Id(companyId, youtuberId)
                .orElse(null);
        if (subscription == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("companySubscription.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        subscription.setIsBlocked(subscriberStatusBindingModel.getIsBlocked());
        this.subscriptionRepository.save(subscription);

        String statusUpdatedMessage = this.resourceBundleUtil.getMessage("companySubscription.statusUpdated");
        return ResponseEntity.ok(new MessageResponse(statusUpdatedMessage));
    }

    @Override
    public ResponseEntity<?> unsubscribe(Youtuber youtuber, Long companyId) {
        Subscription subscription = this.subscriptionRepository
                .findById_Company_IdAndId_Youtuber_Id(companyId, youtuber.getId()).orElse(null);

        if (subscription == null) {
            String unsubscribeNotExist = this.resourceBundleUtil.getMessage("subscription.unsubscribeNotExist");
            return new ResponseEntity<>(new MessagesResponse(unsubscribeNotExist), HttpStatus.NOT_FOUND);
        }

        this.subscriptionRepository.delete(subscription);
        String unsubscribeSuccessfullyMessage = this.resourceBundleUtil.getMessage("subscription.unsubscribeSuccessfully");
        return ResponseEntity.ok(new MessageResponse(unsubscribeSuccessfullyMessage));
    }

    @Override
    public ResponseEntity<Boolean> checkSubscription(Long youtuberId, Long companyId) {
        Boolean existSub = this.subscriptionRepository.existsById_Company_IdAndId_Youtuber_Id(companyId, youtuberId);
        return ResponseEntity.ok(existSub);
    }
}
