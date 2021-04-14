package com.tugab.adspartners.domain.models.binding.company;

import lombok.Data;

@Data
public class CompanyResponse {

    private String userName;

    private String logoUrl;

    private Integer adsCount;
}
