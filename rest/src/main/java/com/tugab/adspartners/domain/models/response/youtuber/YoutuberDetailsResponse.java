package com.tugab.adspartners.domain.models.response.youtuber;

import com.tugab.adspartners.domain.models.response.application.YoutuberApplicationResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class YoutuberDetailsResponse {

    private Long id;

    private String name;

    private String email;

    private Long subscriberCount;

    private Long videoCount;

    private Long viewCount;

    private String profilePicture;

    private String description;

    private Date publishedAt;

    private Date updateDate;

    private String channelId;

    private List<YoutuberApplicationResponse> adApplicationList;
}
