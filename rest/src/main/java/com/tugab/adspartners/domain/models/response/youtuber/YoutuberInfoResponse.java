package com.tugab.adspartners.domain.models.response.youtuber;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class YoutuberInfoResponse {

    private String name;

    private String email;

    private List<String> authorities = new ArrayList<>();

    public void addAuthority(String authority) {
        this.authorities.add(authority);
    }
}
