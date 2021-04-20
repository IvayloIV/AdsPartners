package com.tugab.adspartners.domain.models.binding;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class RegisterCompanyBindingModel {

    private String userName;

    private String userEmail;

    private String userPassword;

    private String phone;

    private Double incomeLastYear;

    private String town;

    private String description;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date companyCreationDate;

    private Integer workersCount;

    private MultipartFile logo;
}
