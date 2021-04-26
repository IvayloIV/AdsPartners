package com.tugab.adspartners.service.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.response.UserInfoResponse;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberInfoResponse;
import com.tugab.adspartners.repository.RoleRepository;
import com.tugab.adspartners.repository.YoutuberRepository;
import com.tugab.adspartners.service.YoutubeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YoutubeServiceImpl extends DefaultOAuth2UserService implements YoutubeService {

    private final String BASE_YOUTUBE_URL = "https://youtube.googleapis.com/youtube/v3";

    private final YoutuberRepository youtuberRepository;
    private final RoleRepository roleRepository;
    private final WebClient webClient;
    private final JsonParser jsonParser;
    private final ModelMapper modelMapper;

    @Autowired
    public YoutubeServiceImpl(YoutuberRepository youtuberRepository,
                              RoleRepository roleRepository,
                              WebClient webClient,
                              JsonParser jsonParser,
                              ModelMapper modelMapper) {
        this.youtuberRepository = youtuberRepository;
        this.roleRepository = roleRepository;
        this.webClient = webClient;
        this.jsonParser = jsonParser;
        this.modelMapper = modelMapper;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        String email = oAuth2User.getAttribute("email");
        Youtuber youtuber;

        if (youtuberRepository.existsByEmail(email)) {
            youtuber = this.youtuberRepository.findByEmail(email);
        } else {
            youtuber = new Youtuber();
            youtuber.setEmail(email);
            youtuber.setName(oAuth2User.getAttribute("name"));

//            this.youtuberRepository.save(youtuber); //TODO: for test
        }

        final String token = oAuth2UserRequest.getAccessToken().getTokenValue();
        youtuber.setToken(token);
        youtuber.setAttributes(oAuth2User.getAttributes());
        this.updateYoutubeDetails(youtuber);
        return youtuber;
    }

    @Override
    public void updateYoutubeDetails(Youtuber youtuber) {
        WebClient.RequestBodySpec requestBodySpec = this.webClient
                .method(HttpMethod.GET)
                .uri(BASE_YOUTUBE_URL + "/channels?part=snippet,contentDetails,statistics&mine=true")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + youtuber.getToken());
        String jsonBlock = requestBodySpec.exchangeToMono(e -> e.bodyToMono(String.class)).block();

        JsonElement jsonElement = this.jsonParser.parse(jsonBlock);
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        JsonArray jsonItems = jsonObject.getAsJsonArray("items");
        if (jsonItems == null || jsonItems.size() > 0) {
            JsonObject jsonObjectDetails = (JsonObject) jsonItems.get(0);
            JsonObject youtubeStatistics = jsonObjectDetails.getAsJsonObject("statistics");

            if (jsonObjectDetails.has("id")) {
                youtuber.setChannelId(jsonObjectDetails.get("id").getAsString());
            }

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
            this.youtuberRepository.save(youtuber); //TODO: after user login i save it, does it needed here??
        }
    }

    public ResponseEntity<?> convertAuthenticationToUserInfo(Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        UserInfoResponse userInfo = this.modelMapper.map(youtuber, UserInfoResponse.class);
        userInfo.getAuthorities().clear();
        youtuber.getAuthorities().forEach(r -> userInfo.addAuthority(r.getAuthority()));
        return ResponseEntity.ok(userInfo);
    }

    @Override
    public Youtuber findByEmail(String email) {
        return this.youtuberRepository.findByEmail(email);
    }

    @Override
    public ResponseEntity<List<YoutuberInfoResponse>> getYoutubersBySubscribers(Integer size) {
        Pageable youtuberPageable = PageRequest.of(0, size);
        Page<Youtuber> youtuberPage = this.youtuberRepository
                .findAllByOrderBySubscriberCountDesc(youtuberPageable);

        List<YoutuberInfoResponse> youtubersInfo = youtuberPage
                .getContent()
                .stream().map(y -> this.modelMapper.map(y, YoutuberInfoResponse.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(youtubersInfo);
    }
}
