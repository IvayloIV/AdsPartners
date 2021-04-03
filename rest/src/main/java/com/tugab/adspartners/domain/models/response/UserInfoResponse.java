package com.tugab.adspartners.domain.models.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserInfoResponse {

    private String name;

    private String email;

    private List<String> authorities = new ArrayList<>();

    public void addAuthority(String authority) {
        this.authorities.add(authority);
    }
}
