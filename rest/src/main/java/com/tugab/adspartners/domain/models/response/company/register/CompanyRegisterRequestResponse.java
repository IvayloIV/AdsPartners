package com.tugab.adspartners.domain.models.response.company.register;

import lombok.Data;

import java.util.Date;

@Data
public class CompanyRegisterRequestResponse {

    private Long id;

    private String userName;

    private String userEmail;

    private String phone;

    private Date userCreatedDate;
}
