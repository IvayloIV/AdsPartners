package com.tugab.adspartners.domain.models.response.ad.list;

import com.tugab.adspartners.domain.models.response.ad.AdRatingResponse;
import lombok.Data;

import java.util.Date;

@Data
public class AdResponse {

    private Long id;

    private String title;

    private Double reward;

    private Date creationDate;

    private Date validTo;

    private Long minVideos;

    private Long minSubscribers;

    private Long minViews;

    private AdCompanyResponse company;

    private String pictureUrl;

    private Double averageRating;

    private Boolean isBlocked;

    private AdRatingResponse ratingResponse;
}
