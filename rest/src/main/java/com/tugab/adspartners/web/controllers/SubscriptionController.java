package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.subscription.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.response.subscription.SubscriptionInfoResponse;
import com.tugab.adspartners.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/subscription")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<SubscriptionInfoResponse>> getList(Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.subscriptionService.getList(company);
    }

    @PostMapping(path = "/subscribe/{companyId}")
    public ResponseEntity<?> subscribe(@PathVariable Long companyId,
                                       Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.subscriptionService.subscribe(youtuber, companyId);
    }

    @PatchMapping
    public ResponseEntity<?> updateStatus(@RequestBody SubscriberStatusBindingModel subscriberStatusBindingModel,
                                          Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        subscriberStatusBindingModel.setCompanyId(company.getUser().getId());
        return this.subscriptionService.updateStatus(subscriberStatusBindingModel);
    }

    @DeleteMapping(path = "/unsubscribe/{companyId}")
    public ResponseEntity<?> unsubscribe(@PathVariable Long companyId,
                                         Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.subscriptionService.unsubscribe(youtuber, companyId);
    }

    @GetMapping(path = "/check/{companyId}")
    public ResponseEntity<Boolean> checkSubscription(@PathVariable Long companyId,
                                                     Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.subscriptionService.checkSubscription(youtuber.getId(), companyId);
    }
}
