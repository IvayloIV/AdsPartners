package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberInfoResponse;
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

    @GetMapping("/list")
    public ResponseEntity<List<YoutuberInfoResponse>> list(@RequestParam("size") Integer size) {
        return this.youtubeService.getList(size);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        Long youtuberId = ((Youtuber) authentication.getPrincipal()).getId();
        return this.youtubeService.getDetails(youtuberId, false);
    }

    @GetMapping("/profile/info") //TODO
    @PreAuthorize("hasAuthority('YOUTUBER')")
    public ResponseEntity<?> userInfo(Authentication authentication) {
        return this.youtubeService.convertAuthenticationToUserInfo(authentication);
    }

    @GetMapping("/details/{youtuberId}")
    public ResponseEntity<?> details(@PathVariable Long youtuberId) {
        return this.youtubeService.getDetails(youtuberId, true);
    }

    @PatchMapping("/profile/update")
    @PreAuthorize("hasAuthority('YOUTUBER')")
    public ResponseEntity<?> updateProfile(Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.youtubeService.updateYoutubeDetails(youtuber);
    }
}
