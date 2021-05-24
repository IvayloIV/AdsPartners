package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/all")
    public String allAccess(HttpServletRequest request) {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasAuthority('YOUTUBER') or hasAuthority('EMPLOYER') or hasAuthority('ADMIN')")
    public String userAccess() {
        return "User Content.";
    }

    @GetMapping("/company")
    @PreAuthorize("hasAuthority('EMPLOYER')")
    public String moderatorAccess() {
        return "Company Board.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }

}
