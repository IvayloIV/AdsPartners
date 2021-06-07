package com.tugab.adspartners.service.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.models.binding.ad.RatingBindingModel;
import com.tugab.adspartners.domain.models.binding.youtuber.YoutuberFilterBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.MessagesResponse;
import com.tugab.adspartners.domain.models.response.UserInfoResponse;
import com.tugab.adspartners.domain.models.response.youtuber.*;
import com.tugab.adspartners.repository.RoleRepository;
import com.tugab.adspartners.repository.YoutuberRatingRepository;
import com.tugab.adspartners.repository.YoutuberRepository;
import com.tugab.adspartners.service.YoutubeService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YoutubeServiceImpl extends DefaultOAuth2UserService implements YoutubeService {

    private final String BASE_YOUTUBE_URL = "https://youtube.googleapis.com/youtube/v3";

    private final YoutuberRepository youtuberRepository;
    private final YoutuberRatingRepository youtuberRatingRepository;
    private final RoleRepository roleRepository;
    private final ResourceBundleUtil resourceBundleUtil;
    private final WebClient webClient;
    private final RestTemplate restTemplate;
    private final JsonParser jsonParser;
    private final ModelMapper modelMapper;

    @Autowired
    public YoutubeServiceImpl(YoutuberRepository youtuberRepository,
                              YoutuberRatingRepository youtuberRatingRepository,
                              RoleRepository roleRepository,
                              ResourceBundleUtil resourceBundleUtil,
                              WebClient webClient,
                              RestTemplate restTemplate,
                              JsonParser jsonParser,
                              ModelMapper modelMapper) {
        this.youtuberRepository = youtuberRepository;
        this.youtuberRatingRepository = youtuberRatingRepository;
        this.roleRepository = roleRepository;
        this.resourceBundleUtil = resourceBundleUtil;
        this.webClient = webClient;
        this.restTemplate = restTemplate;
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
        }

        final String token = oAuth2UserRequest.getAccessToken().getTokenValue();
        youtuber.setToken(token);
        youtuber.setAttributes(oAuth2User.getAttributes());

        ResponseEntity<?> responseEntity = this.updateYoutubeDetails(youtuber);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            this.youtuberRepository.save(youtuber);
        }

        return youtuber;
    }

    @Override
    public ResponseEntity<?> updateYoutubeDetails(Youtuber youtuber) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(youtuber.getToken());

        HttpEntity entity = new HttpEntity(headers);
        final String getYoutuberDataUrl = BASE_YOUTUBE_URL + "/channels?part=snippet,contentDetails,statistics&mine=true";
        ResponseEntity<String> responseEntity = this.restTemplate
                .exchange(getYoutuberDataUrl, HttpMethod.GET, entity, String.class);

        if (responseEntity.getStatusCode() != HttpStatus.OK || responseEntity.getBody() == null) {
            String unavailableServiceMessage = this.resourceBundleUtil.getMessage("youtuberProfile.unavailableService");
            return new ResponseEntity<>(new MessagesResponse(unavailableServiceMessage), HttpStatus.SERVICE_UNAVAILABLE);
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

    @Override
    public ResponseEntity<YoutuberListResponse> getYoutubersList(YoutuberFilterBindingModel youtuberFilterBindingModel) {
        Pageable pageable = PageRequest.of(youtuberFilterBindingModel.getPage() - 1, youtuberFilterBindingModel.getSize());
        Page<Youtuber> youtubersPage = this.youtuberRepository.findAll(youtuberFilterBindingModel, pageable);

        List<YoutuberResponse> youtubersListResponse = youtubersPage.getContent().stream()
                .map(this::setYoutuberAverageRating)
                .map(a -> this.modelMapper.map(a, YoutuberResponse.class))
                .collect(Collectors.toList());

        YoutuberListResponse youtuberListResponse = new YoutuberListResponse();
        youtuberListResponse.setItems(youtubersListResponse);
        youtuberListResponse.setElementsPerPage(youtubersPage.getSize());
        youtuberListResponse.setTotalPages(youtubersPage.getTotalPages());
        youtuberListResponse.setTotalElements(youtubersPage.getTotalElements());

        return ResponseEntity.ok(youtuberListResponse);
    }

    @Override
    public ResponseEntity<FiltersResponse> getYoutuberFilters() {
        final SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy");

        List<Youtuber> youtubers = this.youtuberRepository.findAll();
        FiltersResponse filtersResponse = new FiltersResponse();

        for (Youtuber youtuber : youtubers) {
            filtersResponse.getSubscribersCount().add(youtuber.getSubscriberCount());
            filtersResponse.getVideosCount().add(youtuber.getVideoCount());
            filtersResponse.getViewsCount().add(youtuber.getViewCount());
            try {
                filtersResponse.getPublishesAt().add(formater.parse(formater.format(youtuber.getPublishedAt())));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok(filtersResponse);
    }

    @Override
    public ResponseEntity<YoutuberRatingResponse> vote(Long youtuberId, RatingBindingModel ratingBindingModel, Company company) {
        Youtuber youtuber = this.youtuberRepository.findById(youtuberId)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect youtuber id."));
        YoutuberRating youtuberRating = new YoutuberRating();
        youtuberRating.setId(new YoutuberRatingId(youtuber, company));
        youtuberRating.setRating(ratingBindingModel.getRating());
        youtuberRating.setCreationDate(new Date());
        this.youtuberRatingRepository.save(youtuberRating);

        YoutuberRatingResponse rating = this.modelMapper.map(youtuberRating, YoutuberRatingResponse.class);
        rating.setYoutuberId(youtuber.getId());
        rating.setCompanyId(company.getId());
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> getDetails(Long youtuberId, Boolean excludeApplications) {
        Youtuber youtuber = this.youtuberRepository.findById(youtuberId).orElseThrow(null);

        if (youtuber == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("youtuberProfile.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        this.setYoutuberAverageRating(youtuber);
        YoutuberDetailsResponse youtuberDetailsResponse = this.modelMapper.map(youtuber, YoutuberDetailsResponse.class);
        if (excludeApplications) {
            youtuberDetailsResponse.setAdApplicationList(null);
        }

        return ResponseEntity.ok(youtuberDetailsResponse);
    }

    private Youtuber setYoutuberAverageRating(Youtuber youtuber) {
        youtuber.getRatingList()
                .stream()
                .mapToInt(YoutuberRating::getRating)
                .average()
                .ifPresent(youtuber::setAverageRating);

        return youtuber;
    }
}
