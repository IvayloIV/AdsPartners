package com.tugab.adspartners.domain.models.binding.company;

import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class RegisterCompanyBindingModel {

    @Length(min = 3, max = 256, message = "{registerCompany.usernameLength}")
    private String userName;

    @Length(min = 5, max = 256, message = "{registerCompany.emailLength}")
    private String userEmail;

    @Length(min = 3, message = "{registerCompany.passwordLength}")
    private String userPassword;

    @Length(min = 3, max = 64, message = "{registerCompany.phoneLength}")
    private String phone;

    @NotNull(message = "{registerCompany.nullIncomeLastYear}")
    @DecimalMin(value = "0.01", message = "{registerCompany.minIncomeLastYear}")
    private Double incomeLastYear;

    @Length(min = 3, max = 256, message = "{registerCompany.townLength}")
    private String town;

    @Length(min = 1, max = 1024, message = "{registerCompany.descriptionLength}")
    private String description;

    @NotNull(message = "{registerCompany.nullCompanyCreationDate}")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date companyCreationDate;

    private Integer workersCount;

    @NotNull(message = "{registerCompany.nullCompanyLogo}")
    private String logoBase64;

    @NotNull(message = "{registerCompany.adminRedirectUrl}")
    private String adminRedirectUrl;
}
