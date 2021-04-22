package com.tugab.adspartners.domain.models.response.company;

import lombok.Data;

@Data
public class CompanyInfoResponse {

    private Long id;

    private String logoUrl;

    private String userName;

    private String town;

    private Double averageRating;
}
