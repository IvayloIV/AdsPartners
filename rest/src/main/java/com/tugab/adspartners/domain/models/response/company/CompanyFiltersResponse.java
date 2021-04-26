package com.tugab.adspartners.domain.models.response.company;

import lombok.Data;

import java.util.Set;

@Data
public class CompanyFiltersResponse {

    public Set<Integer> adCounts;
}
