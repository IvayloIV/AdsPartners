package com.tugab.adspartners.domain.models.binding.company;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class LoginCompanyBindingModel {

    @NotEmpty(message = "{companyLogin.emptyEmail}")
    private String email;

    @NotEmpty(message = "{companyLogin.emptyPassword}")
    private String password;
}
