package com.tugab.adspartners.domain.models.binding;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RegisterCompanyBindingModel {

    private String userName;

    private String userEmail;

    private String userPassword;

    private Integer workersCount;

    private MultipartFile logo;
}
