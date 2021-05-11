package com.tugab.adspartners.domain.models.response.youtuber;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tugab.adspartners.domain.enums.ApplicationType;
import com.tugab.adspartners.domain.models.response.ad.list.AdYoutuberApplicationResponse;
import lombok.Data;

import java.util.Date;

@Data
public class YoutuberApplicationResponse {

    @JsonProperty("ad")
    private AdYoutuberApplicationResponse idAd;

    private String description;

    private Date applicationDate;

    private ApplicationType type;
}
