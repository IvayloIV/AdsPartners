package com.tugab.adspartners.domain.models.response.ad.details;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class SubscriptionInfoResponse {

    @JsonProperty("youtuber")
    private YoutuberDetailsResponse idYoutuber;

    private Date subscriptionDate;

    private Boolean isBlocked;
}
