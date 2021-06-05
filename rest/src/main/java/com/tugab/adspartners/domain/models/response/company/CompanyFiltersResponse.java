package com.tugab.adspartners.domain.models.response.company;

import lombok.Data;

import java.util.List;

@Data
public class CompanyFiltersResponse {

    public List<Long> adCounts;
}
