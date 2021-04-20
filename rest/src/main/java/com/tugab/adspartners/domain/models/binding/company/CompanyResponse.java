package com.tugab.adspartners.domain.models.binding.company;

import lombok.Data;

@Data
public class CompanyResponse {

    private Long id;

    private String userName;

    private String userEmail;

    private String logoUrl;

    private Integer adsCount;

    private Integer workersCount;
}
