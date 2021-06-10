package com.tugab.adspartners.domain.models.response.ad.details;

import com.tugab.adspartners.domain.entities.Characteristic;
import com.tugab.adspartners.domain.models.response.ad.rating.RatingResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class AdDetailsResponse {

    private Long id;

    private String title;

    private String shortDescription;

    private Double reward;

    private Date creationDate;

    private Date validTo;

    private Long minVideos;

    private Long minSubscribers;

    private Long minViews;

    private Boolean isBlocked;

    private String pictureUrl;

    private List<Characteristic> characteristics;

    private Double averageRating;

    private CompanySubscriptionResponse company;

    private RatingResponse ratingResponse;

    private Integer applicationCount;
}
