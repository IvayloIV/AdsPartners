package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.response.youtuber.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface YoutubeService extends OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest);

    public Youtuber findByEmail(String email);

    public ResponseEntity<?> updateYoutubeDetails(Youtuber youtuber);

    public ResponseEntity<List<YoutuberListResponse>> getList(Integer size);

    public ResponseEntity<?> getDetails(Long youtuberId, Collection<? extends GrantedAuthority> authorities);
}
