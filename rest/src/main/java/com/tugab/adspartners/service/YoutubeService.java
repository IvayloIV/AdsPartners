package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.RatingBindingModel;
import com.tugab.adspartners.domain.models.binding.youtuber.YoutuberFilterBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.youtuber.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YoutubeService extends OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest);

    public Youtuber findByEmail(String email);

    public ResponseEntity<?> updateYoutubeDetails(Youtuber youtuber);

    public ResponseEntity<?> convertAuthenticationToUserInfo(Authentication authentication);

    public ResponseEntity<List<YoutuberInfoResponse>> getYoutubersBySubscribers(Integer size);

    public ResponseEntity<YoutuberListResponse> getYoutubersList(YoutuberFilterBindingModel youtuberFilterBindingModel);

    public ResponseEntity<FiltersResponse> getYoutuberFilters();

    public ResponseEntity<YoutuberRatingResponse> vote(Long youtuberId, RatingBindingModel ratingBindingModel, Company company);

    public ResponseEntity<?> getDetails(Long youtuberId, Boolean excludeApplications);
}
