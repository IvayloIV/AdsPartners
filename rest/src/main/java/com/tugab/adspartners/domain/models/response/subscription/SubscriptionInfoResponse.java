package com.tugab.adspartners.domain.models.response.subscription;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tugab.adspartners.domain.models.response.application.YoutuberDetailsResponse;
import lombok.Data;

import java.util.Date;

@Data
public class SubscriptionInfoResponse {

    @JsonProperty("youtuber")
    private YoutuberDetailsResponse idYoutuber;

    private Date subscriptionDate;

    private Boolean isBlocked;
}
