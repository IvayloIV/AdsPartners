package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class YoutuberProfileResponse {

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

    private Double averageRating;

    private List<YoutuberApplicationResponse> adApplicationList;
}
