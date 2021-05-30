package com.tugab.adspartners.domain.models.binding.ad;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CharacteristicBindingModel {

    @Length(min = 2, message = "{createAd.charName}")
    private String name;

    @Length(min = 1, message = "{createAd.charValue}")
    private String value;
}
