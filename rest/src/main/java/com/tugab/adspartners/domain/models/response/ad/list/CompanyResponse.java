package com.tugab.adspartners.domain.models.response.ad.list;

import lombok.Data;

@Data
public class CompanyResponse {

    private Long id;

    private String logoUrl;

    private Integer adsCount;
}
