package com.tugab.adspartners.domain.models.binding.ad;

import com.tugab.adspartners.domain.entities.Youtuber;
import lombok.Data;

@Data
public class AdApplicationBindingModel {

    private Youtuber youtuber;

    private Long adId;

    private String description;
}
