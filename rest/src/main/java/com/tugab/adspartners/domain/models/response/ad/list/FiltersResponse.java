package com.tugab.adspartners.domain.models.response.ad.list;

import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import lombok.Data;

import java.util.*;

@Data
public class FiltersResponse {

    private List<Double> rewards;

    private List<Long> minVideos;

    private List<Long> minSubscribers;

    private List<Long> minViews;

    private List<CompanyListResponse> companies;
}
