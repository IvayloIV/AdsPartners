package com.tugab.adspartners.domain.models.binding.youtuber;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class YoutuberFilterBindingModel {

    private String name;

    private String description;

    private Long minSubscriberCount;

    private Long maxSubscriberCount;

    private Long minVideoCount;

    private Long maxVideoCount;

    private Long minViewCount;

    private Long maxViewCount;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startPublishedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endPublishedAt;

    private Integer size = 12;

    private Integer page = 1;
}
