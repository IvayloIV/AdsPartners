package com.tugab.adspartners.domain.models.response.company.details;

import lombok.Data;

import java.util.Date;

@Data
public class CompanyProfileResponse {

    private Long id;

    private String userName;

    private String userEmail;

    private Date userCreatedDate;

    private String phone;

    private Double incomeLastYear;

    private String town;

    private String description;

    private Integer workersCount;

    private Date companyCreationDate;

    private String logoUrl;

    private Integer adsCount;
}
