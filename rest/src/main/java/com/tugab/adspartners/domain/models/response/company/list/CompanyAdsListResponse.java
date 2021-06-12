package com.tugab.adspartners.domain.models.response.company.list;

import lombok.Data;

import java.util.List;

@Data
public class CompanyAdsListResponse {

    private List<CompanyAdsResponse> items;

    private Integer elementsPerPage;

    private Long totalElements;

    private Integer totalPages;
}
