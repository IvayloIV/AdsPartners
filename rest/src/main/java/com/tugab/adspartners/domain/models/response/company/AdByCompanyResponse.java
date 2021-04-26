package com.tugab.adspartners.domain.models.response.company;

import lombok.Data;

import java.util.Date;

@Data
public class AdByCompanyResponse {

    private Long id;

    private String title;

    private Double reward;

    private Double averageRating;

    private String pictureUrl;

    private Date validTo;

    private Boolean isBlocked;
}
