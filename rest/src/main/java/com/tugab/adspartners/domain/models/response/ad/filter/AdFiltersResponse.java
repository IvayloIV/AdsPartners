package com.tugab.adspartners.domain.models.response.ad.filter;

import lombok.Data;

import java.util.*;

@Data
public class AdFiltersResponse {

    private List<Double> rewards;

    private List<Long> minVideos;

    private List<Long> minSubscribers;

    private List<Long> minViews;

    private List<AdFilterCompanyResponse> companies;
}
