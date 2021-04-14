package com.tugab.adspartners.domain.models.response.ad.list;

import lombok.Data;

import java.util.List;

@Data
public class AdListResponse {

    private List<AdResponse> items;

    private Integer elementsPerPage;

    private Long totalElements;

    private Integer totalPages;
}
