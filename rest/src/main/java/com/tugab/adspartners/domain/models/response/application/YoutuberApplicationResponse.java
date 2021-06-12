package com.tugab.adspartners.domain.models.response.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class YoutuberApplicationResponse {

    @JsonProperty("ad")
    private AdYoutuberApplicationResponse idAd;

    private String description;

    private Date applicationDate;
}
