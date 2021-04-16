package com.tugab.adspartners.domain.models.response.ad.details;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tugab.adspartners.domain.enums.ApplicationType;
import lombok.Data;

import java.util.Date;

@Data
public class AdApplicationResponse {

    @JsonProperty("youtuber")
    private YoutuberDetailsResponse idYoutuber;

    private Date applicationDate;

    private ApplicationType type;
}
