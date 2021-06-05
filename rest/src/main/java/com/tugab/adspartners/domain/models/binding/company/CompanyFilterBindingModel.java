package com.tugab.adspartners.domain.models.binding.company;

import lombok.Data;

@Data
public class CompanyFilterBindingModel {

    private String name;

    private String email;

    private String town;

    private Integer minAdsCount;

    private Integer maxAdsCount;

    private Integer page = 1;

    private Integer size = 10;

    private Boolean isBlocked;
}
