package com.tugab.adspartners.domain.models.binding.company;

import com.tugab.adspartners.domain.enums.RegistrationStatus;
import lombok.Data;

@Data
public class UpdateStatusBindingModel {

    private RegistrationStatus status;
}
