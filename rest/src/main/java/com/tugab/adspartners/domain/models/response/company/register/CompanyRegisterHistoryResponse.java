package com.tugab.adspartners.domain.models.response.company.register;

import com.tugab.adspartners.domain.enums.RegistrationStatus;
import lombok.Data;

import java.util.Date;

@Data
public class CompanyRegisterHistoryResponse {

    private Long id;

    private String userName;

    private String userEmail;

    private String phone;

    private Date userCreatedDate;

    private RegistrationStatus status;

    private Date statusModifyDate;
}
