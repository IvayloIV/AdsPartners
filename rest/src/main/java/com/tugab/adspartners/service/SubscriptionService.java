package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.subscription.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.response.subscription.SubscriptionInfoResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SubscriptionService {

    public ResponseEntity<List<SubscriptionInfoResponse>> getList(Company company);

    public ResponseEntity<?> subscribe(Youtuber youtuber, Long companyId);

    public ResponseEntity<?> updateStatus(SubscriberStatusBindingModel subscriberStatusBindingModel);

    public ResponseEntity<?> unsubscribe(Youtuber youtuber, Long companyId);

    public ResponseEntity<Boolean> checkSubscription(Long youtuberId, Long companyId);
}
