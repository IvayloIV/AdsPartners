package com.tugab.adspartners.domain.models.response.ad.rating;

import lombok.Data;

import java.util.Date;

@Data
public class CreateRatingResponse {

    private Long adId;

    private Long youtubeId;

    private Integer rating;

    private Date creationDate;
}
