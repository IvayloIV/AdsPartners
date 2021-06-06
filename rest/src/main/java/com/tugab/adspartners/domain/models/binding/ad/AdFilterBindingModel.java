package com.tugab.adspartners.domain.models.binding.ad;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class AdFilterBindingModel {

    private Long companyId;

    private String title;

    private String description;

    private Double minReward;

    private Double maxReward;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startCreationDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endCreationDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startValidTo;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endValidTo;

    private Long minVideos;

    private Long maxVideos;

    private Long minSubscribers;

    private Long maxSubscribers;

    private Long minViews;

    private Long maxViews;

    private Boolean isBlocked;

    private Integer size = 12;

    private Integer page = 1;
}
