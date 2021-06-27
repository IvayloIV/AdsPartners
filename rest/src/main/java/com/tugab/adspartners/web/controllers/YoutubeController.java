package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberListResponse;
import com.tugab.adspartners.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/youtube")
@CrossOrigin(origins = "*")
public class YoutubeController {

    private final YoutubeService youtubeService;

    @Autowired
    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<YoutuberListResponse>> list(@RequestParam("size") Integer size) {
        return this.youtubeService.getList(size);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        Long youtuberId = ((Youtuber) authentication.getPrincipal()).getId();
        return this.youtubeService.getDetails(youtuberId, authentication.getAuthorities());
    }

    @GetMapping("/details/{youtuberId}")
    public ResponseEntity<?> details(@PathVariable Long youtuberId, Authentication authentication) {
        return this.youtubeService.getDetails(youtuberId, authentication.getAuthorities());
    }

    @PatchMapping("/profile/update")
    public ResponseEntity<?> updateProfile(Authentication authentication) {
        Youtuber youtuber = (Youtuber) authentication.getPrincipal();
        return this.youtubeService.updateYoutubeDetails(youtuber);
    }
}

