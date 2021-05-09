package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

import java.util.Date;

@Data
public class YoutuberResponse {

    private Long id;

    private String name;

    private String email;

    private Long subscriberCount;

    private Long videoCount;

    private Long viewCount;

    private String profilePicture;

    private String description;

    private Date publishedAt;

    private String channelId;

    public Double averageRating;
}
