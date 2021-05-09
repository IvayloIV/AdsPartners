package com.tugab.adspartners.domain.models.response.youtuber;

import com.tugab.adspartners.domain.models.response.ad.list.AdResponse;
import lombok.Data;

import java.util.List;

@Data
public class YoutuberListResponse {

    private List<YoutuberResponse> items;

    private Integer elementsPerPage;

    private Long totalElements;

    private Integer totalPages;
}
