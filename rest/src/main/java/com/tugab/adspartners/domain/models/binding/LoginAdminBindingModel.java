package com.tugab.adspartners.domain.models.binding;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class LoginAdminBindingModel {

    @NotEmpty(message = "{adminLogin.emptyEmail}")
    private String email;

    @NotEmpty(message = "{adminLogin.emptyPassword}")
    private String password;
}
