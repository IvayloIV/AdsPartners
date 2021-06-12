package com.tugab.adspartners.domain.models.response.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import lombok.Data;

import java.util.Date;

@Data
public class AdApplicationResponse {

    @JsonProperty("youtuber")
    private YoutuberDetailsResponse idYoutuber;

    @JsonProperty("ad")
    private AdDetailsResponse idAd;

    private String description;

    private Date applicationDate;
}
