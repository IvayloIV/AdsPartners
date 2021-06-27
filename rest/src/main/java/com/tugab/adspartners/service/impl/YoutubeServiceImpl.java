package com.tugab.adspartners.service.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.models.response.common.ErrorResponse;
import com.tugab.adspartners.domain.models.response.common.MessageResponse;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberDetailsResponse;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberListResponse;
import com.tugab.adspartners.repository.YoutuberRepository;
import com.tugab.adspartners.service.YoutubeService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YoutubeServiceImpl extends DefaultOAuth2UserService implements YoutubeService {

    private final String BASE_YOUTUBE_URL = "https://youtube.googleapis.com/youtube/v3";

    private final YoutuberRepository youtuberRepository;
    private final ResourceBundleUtil resourceBundleUtil;
    private final RestTemplate restTemplate;
    private final JsonParser jsonParser;
    private final ModelMapper modelMapper;

    @Autowired
    public YoutubeServiceImpl(YoutuberRepository youtuberRepository,
                              ResourceBundleUtil resourceBundleUtil,
                              RestTemplate restTemplate,
                              JsonParser jsonParser,
                              ModelMapper modelMapper) {
        this.youtuberRepository = youtuberRepository;
        this.resourceBundleUtil = resourceBundleUtil;
        this.restTemplate = restTemplate;
        this.jsonParser = jsonParser;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResponseEntity<List<YoutuberListResponse>> getList(Integer size) {
        Pageable youtuberPageable = PageRequest.of(0, size);
        Page<Youtuber> youtuberPage = this.youtuberRepository
                .findAllByOrderBySubscriberCountDesc(youtuberPageable);

        List<YoutuberListResponse> youtubersInfo = youtuberPage
                .getContent()
                .stream().map(y -> this.modelMapper.map(y, YoutuberListResponse.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(youtubersInfo);
    }

    @Override
    public ResponseEntity<?> getDetails(Long youtuberId, Collection<? extends GrantedAuthority> authorities) {
        Youtuber youtuber = this.youtuberRepository.findById(youtuberId).orElse(null);

        if (youtuber == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("youtuberProfile.wrongId");
            return new ResponseEntity<>(new ErrorResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        YoutuberDetailsResponse youtuberDetailsResponse = this.modelMapper.map(youtuber, YoutuberDetailsResponse.class);
        if (authorities.stream().anyMatch(a -> a.getAuthority().equals(Authority.EMPLOYER.name()))) {
            youtuberDetailsResponse.setAdApplicationList(null);
        }

        return ResponseEntity.ok(youtuberDetailsResponse);
    }

    @Override
    public ResponseEntity<?> updateYoutubeDetails(Youtuber youtuber) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(youtuber.getToken());

        HttpEntity entity = new HttpEntity(headers);
        final String getYoutuberDataUrl = BASE_YOUTUBE_URL + "/channels?part=snippet,contentDetails,statistics&mine=true";
        String unavailableServiceMessage = this.resourceBundleUtil.getMessage("youtuberProfile.unavailableService");
        ResponseEntity<String> responseEntity;

        try {
            responseEntity = this.restTemplate
                    .exchange(getYoutuberDataUrl, HttpMethod.GET, entity, String.class);
        } catch (Exception ex) {
            return new ResponseEntity<>(new ErrorResponse(unavailableServiceMessage), HttpStatus.SERVICE_UNAVAILABLE);
        }

        if (responseEntity.getStatusCode() != HttpStatus.OK || responseEntity.getBody() == null) {
            return new ResponseEntity<>(new ErrorResponse(unavailableServiceMessage), HttpStatus.SERVICE_UNAVAILABLE);
        }

        JsonElement jsonElement = this.jsonParser.parse(responseEntity.getBody());
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        JsonArray jsonItems = jsonObject.getAsJsonArray("items");
        JsonObject jsonObjectDetails = (JsonObject) jsonItems.get(0);

        if (jsonObjectDetails.has("id")) {
            youtuber.setChannelId(jsonObjectDetails.get("id").getAsString());
        }

        JsonObject youtubeStatistics = jsonObjectDetails.getAsJsonObject("statistics");

        if (youtubeStatistics.has("subscriberCount")) {
            youtuber.setSubscriberCount(youtubeStatistics.get("subscriberCount").getAsLong());
        }
        if (youtubeStatistics.has("viewCount")) {
            youtuber.setViewCount(youtubeStatistics.get("viewCount").getAsLong());
        }
        if (youtubeStatistics.has("videoCount")) {
            youtuber.setVideoCount(youtubeStatistics.get("videoCount").getAsLong());
        }

        JsonObject jsonSnippet = jsonObjectDetails.getAsJsonObject("snippet");
        if (jsonSnippet.has("description")) {
            youtuber.setDescription(jsonSnippet.get("description").getAsString());
        }
        if (jsonSnippet.has("publishedAt")) {
            String publishedAtStr = jsonSnippet.get("publishedAt").getAsString();
            Instant publishedAtInstant = Instant.parse(publishedAtStr);
            youtuber.setPublishedAt(Date.from(publishedAtInstant));
        }

        JsonObject jsonThumbnails = jsonSnippet.getAsJsonObject("thumbnails");
        JsonObject jsonThumbnailHigh = jsonThumbnails.getAsJsonObject("high");
        if (jsonThumbnailHigh.has("url")) {
            youtuber.setProfilePicture(jsonThumbnailHigh.get("url").getAsString());
        }

        youtuber.setUpdateDate(new Date());
        this.youtuberRepository.save(youtuber);

        String successUpdatedMessage = this.resourceBundleUtil.getMessage("youtuberProfile.successUpdated");
        return ResponseEntity.ok(new MessageResponse(successUpdatedMessage));
    }

    @Override
    public Youtuber findByEmail(String email) {
        return this.youtuberRepository.findByEmail(email);
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        String email = oAuth2User.getAttribute("email");
        Youtuber youtuber;

        if (youtuberRepository.existsByEmail(email)) {
            youtuber = this.youtuberRepository.findByEmail(email);
        } else {
            youtuber = new Youtuber();
            youtuber.setEmail(email);
            youtuber.setName(oAuth2User.getAttribute("name"));
        }

        final String token = oAuth2UserRequest.getAccessToken().getTokenValue();
        youtuber.setToken(token);
        youtuber.setAttributes(oAuth2User.getAttributes());

        ResponseEntity<?> responseEntity = this.updateYoutubeDetails(youtuber);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            youtuber.setToken(null);
        }

        return youtuber;
    }
}
