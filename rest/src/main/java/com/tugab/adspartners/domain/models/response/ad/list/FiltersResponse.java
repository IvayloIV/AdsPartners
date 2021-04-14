package com.tugab.adspartners.domain.models.response.ad.list;

import lombok.Data;

import java.util.*;

@Data
public class FiltersResponse {

    private Set<Double> rewards = new TreeSet<>();

    private Set<Date> createdDates = new TreeSet<>();

    private Set<Date> validToDates = new TreeSet<>();

    private Set<Long> minVideos = new TreeSet<>();

    private Set<Long> minSubscribers = new TreeSet<>();

    private Set<Long> minViews = new TreeSet<>();
}
