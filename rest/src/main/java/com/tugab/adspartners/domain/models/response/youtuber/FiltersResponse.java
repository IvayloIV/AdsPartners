package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

@Data
public class FiltersResponse {

    private Set<Long> subscribersCount = new TreeSet<>();

    private Set<Long> videosCount = new TreeSet<>();

    private Set<Long> viewsCount = new TreeSet<>();

    private Set<Date> publishesAt = new TreeSet<>();
}
