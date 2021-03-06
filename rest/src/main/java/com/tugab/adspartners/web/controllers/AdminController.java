package com.tugab.adspartners.web.controllers;

import com.tugab.adspartners.domain.models.binding.admin.LoginAdminBindingModel;
import com.tugab.adspartners.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody LoginAdminBindingModel loginAdminBindingModel,
                                        Errors errors) {
        return this.adminService.login(loginAdminBindingModel, errors);
    }
}
