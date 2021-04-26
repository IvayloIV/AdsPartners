package com.tugab.adspartners.domain.models.response.company;

import lombok.Data;

import java.util.List;

@Data
public class CompanyAdsResponse {

    private Long id;

    private String userName;

    private String userEmail;

    private String phone;

    private String town;

    private Integer totalAdsCount;

    private List<AdByCompanyResponse> ads;
}
