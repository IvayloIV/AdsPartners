package com.tugab.adspartners.domain.models.response.ad.details;

import com.tugab.adspartners.domain.entities.Characteristic;
import com.tugab.adspartners.domain.models.response.ad.AdRatingResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class AdDetailsResponse {

    private Long id;

    private String title;

    private String description;

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

    private AdDetailsCompanyResponse company;

    private AdRatingResponse ratingResponse;

    private Integer applicationCount;
}
