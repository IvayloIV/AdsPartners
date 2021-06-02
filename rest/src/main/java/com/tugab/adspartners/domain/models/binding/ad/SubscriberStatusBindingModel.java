package com.tugab.adspartners.domain.models.binding.ad;

import lombok.Data;

@Data
public class SubscriberStatusBindingModel {

    private Long youtuberId;

    private Long companyId;

    private Boolean isBlocked;
}
