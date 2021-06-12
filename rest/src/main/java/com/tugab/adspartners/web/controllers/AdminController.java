package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.models.binding.admin.LoginAdminBindingModel;
import com.tugab.adspartners.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody LoginAdminBindingModel loginAdminBindingModel,
                                        Errors errors) {
        return this.userService.loginAdmin(loginAdminBindingModel, errors);
    }
}
