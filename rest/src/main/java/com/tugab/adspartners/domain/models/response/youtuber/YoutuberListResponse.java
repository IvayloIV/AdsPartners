package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

@Data
public class YoutuberListResponse {

    private String name;

    private Long subscriberCount;

    private String profilePicture;

    private String channelId;
}
