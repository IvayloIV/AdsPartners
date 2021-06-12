package com.tugab.adspartners.domain.models.response.ad;

import lombok.Data;

import java.util.Date;

@Data
public class AdRatingResponse {

    private Long adId;

    private Long youtubeId;

    private Integer rating;

    private Date creationDate;
}
