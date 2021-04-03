package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.CloudinaryResource;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Role;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.response.JwtResponse;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.repository.CompanyRepository;
import com.tugab.adspartners.repository.RoleRepository;
import com.tugab.adspartners.repository.UserRepository;
import com.tugab.adspartners.security.jwt.JwtUtils;
import com.tugab.adspartners.service.CloudinaryService;
import com.tugab.adspartners.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final ModelMapper modelMapper;
    private final JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(CloudinaryService cloudinaryService,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           CompanyRepository companyRepository,
                           ModelMapper modelMapper,
                           JwtUtils jwtUtils) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.modelMapper = modelMapper;
        this.jwtUtils = jwtUtils;
    }

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel) {
        if (userRepository.existsByEmail(registerCompanyBindingModel.getUserEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already taken!")); //TODO: properties file
        }

        Company company = this.modelMapper.map(registerCompanyBindingModel, Company.class);
        company.setWorkersCount(registerCompanyBindingModel.getWorkersCount());
        CloudinaryResource cloudinaryResource = this.cloudinaryService.uploadImage(registerCompanyBindingModel.getLogo());
        company.setLogo(cloudinaryResource);

        User user = company.getUser();
        user.setPassword(this.passwordEncoder.encode(registerCompanyBindingModel.getUserPassword()));
        user.setCreatedDate(new Date());

        Role employerRole = this.roleRepository.findByAuthority(Authority.EMPLOYER)
                .orElseThrow(() -> new IllegalArgumentException("Employer role not found."));
        user.addRole(employerRole);

        this.companyRepository.save(company);
        return ResponseEntity.ok(new MessageResponse("Company registered successfully!"));
    }

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel) {
        String employerEmail = loginCompanyBindingModel.getEmail();
        String employerPassword = loginCompanyBindingModel.getPassword();

        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(employerEmail, employerPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = this.jwtUtils.generateJwtToken(authentication);

        User user = (User) authentication.getPrincipal();
        List<String> roles = user.getRoles().stream()
                .map(Role::getAuthority)
                .collect(Collectors.toList());

        JwtResponse jwtResponse = new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), roles);
        return ResponseEntity.ok(jwtResponse);
    }

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginCompanyBindingModel) { //TODO: repetition with upper method
        String adminEmail = loginCompanyBindingModel.getEmail();
        String adminPassword = loginCompanyBindingModel.getPassword();

        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(adminEmail, adminPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = this.jwtUtils.generateJwtToken(authentication);

        User user = (User) authentication.getPrincipal();
        List<String> roles = user.getRoles().stream()
                .map(Role::getAuthority)
                .collect(Collectors.toList());

        JwtResponse jwtResponse = new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), roles);
        return ResponseEntity.ok(jwtResponse);
    }

    @Override
    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email) //TODO: repeated with other method...
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
        return user;
    }
}
