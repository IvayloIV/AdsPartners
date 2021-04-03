package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/youtube")
public class YoutubeController {

    private final YoutubeService youtubeService;

    @Autowired
    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @PostMapping("/profile/update")
    @PreAuthorize("hasAuthority('YOUTUBER')") //TODO: It should return some response
    public void updateDetails(Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();

        //TODO: How to get jwt token example
//        OAuth2AuthorizedClient client = this.authClientService
//                .loadAuthorizedClient(authenticationToken.getAuthorizedClientRegistrationId(),
//                        authenticationToken.getName());
//        String token = client.getAccessToken().getTokenValue();

        this.youtubeService.updateYoutubeDetails(youtuber);
    }

    @GetMapping("/profile/info")
    @PreAuthorize("hasAuthority('YOUTUBER')")
    public ResponseEntity<?> userInfo(Authentication authentication) {
        return this.youtubeService.convertAuthenticationToUserInfo(authentication);
    }
}
