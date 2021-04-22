package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

@Data
public class YoutuberInfoResponse {

    private String name;

    private Long subscriberCount;

    private String profilePicture;

    private String channelId;
}
