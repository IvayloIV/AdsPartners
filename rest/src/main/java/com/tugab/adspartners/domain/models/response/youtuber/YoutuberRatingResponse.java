package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

import java.util.Date;

@Data
public class YoutuberRatingResponse {

    private Long youtuberId;

    private Long companyId;

    private Integer rating;

    private Date creationDate;
}
