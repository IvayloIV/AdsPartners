package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.RatingBindingModel;
import com.tugab.adspartners.domain.models.binding.youtuber.YoutuberFilterBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.youtuber.*;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/youtube")
public class YoutubeController {

    private final YoutubeService youtubeService;

    @Autowired
    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/profile")
    public ResponseEntity<YoutuberProfileResponse> getProfile(Authentication authentication) {
        return this.youtubeService.getProfile(authentication);
    }

    @GetMapping("/details/{youtuberId}")
    public ResponseEntity<YoutuberDetailsResponse> getDetails(@PathVariable("youtuberId") Long youtuberId) {
        return this.youtubeService.getDetails(youtuberId);
    }

    @PostMapping("/profile/update")
    @PreAuthorize("hasAuthority('YOUTUBER')") //TODO: It should return some response
    public ResponseEntity<MessageResponse> updateDetails(Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();

        //TODO: How to get jwt token example
//        OAuth2AuthorizedClient client = this.authClientService
//                .loadAuthorizedClient(authenticationToken.getAuthorizedClientRegistrationId(),
//                        authenticationToken.getName());
//        String token = client.getAccessToken().getTokenValue();

        return this.youtubeService.updateYoutubeDetails(youtuber);
    }

    @GetMapping("/profile/info")
    @PreAuthorize("hasAuthority('YOUTUBER')")
    public ResponseEntity<?> userInfo(Authentication authentication) {
        return this.youtubeService.convertAuthenticationToUserInfo(authentication);
    }

    @GetMapping("/list/subscribers")
    public ResponseEntity<List<YoutuberInfoResponse>> getYoutubersBySubs(@RequestParam("size") Integer size) {
        return this.youtubeService.getYoutubersBySubscribers(size);
    }

    @GetMapping("/list")
    public ResponseEntity<YoutuberListResponse> getList(YoutuberFilterBindingModel youtuberFilterBindingModel) {
        return this.youtubeService.getYoutubersList(youtuberFilterBindingModel);
    }

    @GetMapping("/filters")
    public ResponseEntity<FiltersResponse> getFilters() {
        return this.youtubeService.getYoutuberFilters();
    }

    @PostMapping(path = "/vote/{id}")
    public ResponseEntity<YoutuberRatingResponse> vote(@PathVariable("id") Long youtuberId,
                                                       @RequestBody RatingBindingModel ratingBindingModel,
                                                       Authentication authentication) {
        Company company = (Company) authentication.getPrincipal();
        return this.youtubeService.vote(youtuberId, ratingBindingModel, company);
    }
}
