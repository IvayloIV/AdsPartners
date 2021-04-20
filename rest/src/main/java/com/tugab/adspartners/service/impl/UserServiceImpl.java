package com.tugab.adspartners.service.impl;

import com.sun.org.apache.xpath.internal.operations.Bool;
import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.response.JwtResponse;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import com.tugab.adspartners.repository.*;
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
    private final SubscriptionRepository subscriptionRepository;
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
                           SubscriptionRepository subscriptionRepository,
                           ModelMapper modelMapper,
                           JwtUtils jwtUtils) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.subscriptionRepository = subscriptionRepository;
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
    public ResponseEntity<List<CompanyListResponse>> getCompanyList() {
        List<Company> companies = this.companyRepository.findAllByOrderByUserName();
        List<CompanyListResponse> companyResponse = companies
                .stream()
                .map(c -> this.modelMapper.map(c, CompanyListResponse.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(companyResponse);
    }

    @Override
    public ResponseEntity<CompanyResponse> getCompanyById(Long id) {
        Company company = this.companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect company id."));

        CompanyResponse companyResponse = this.modelMapper.map(company, CompanyResponse.class);
        companyResponse.setAdsCount(company.getAds().size());
        return ResponseEntity.ok(companyResponse);
    }

    @Override
    public ResponseEntity<List<SubscriptionInfoResponse>> getCompanySubscribers(Company company) {
        List<Subscription> subscriptions = this.subscriptionRepository.findById_Company(company);
        List<SubscriptionInfoResponse> subscriptionInfoResponses = subscriptions
                .stream()
                .map(s -> this.modelMapper.map(s, SubscriptionInfoResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(subscriptionInfoResponses);
    }

    @Override
    public ResponseEntity<MessageResponse> changeSubscriberStatus(SubscriberStatusBindingModel subscriberStatusBindingModel) {
        Long companyId = subscriberStatusBindingModel.getCompanyId();
        Long youtuberId = subscriberStatusBindingModel.getYoutuberId();

        Subscription subscription = this.subscriptionRepository.findById_Company_IdAndId_Youtuber_Id(companyId, youtuberId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription does not found."));
        subscription.setIsBlocked(subscriberStatusBindingModel.getIsBlocked());

        this.subscriptionRepository.save(subscription);
        return ResponseEntity.ok(new MessageResponse("Subscription was changed successfully."));
    }

    public ResponseEntity<MessageResponse> subscribe(Youtuber youtuber, Long companyId) {
        Company company = this.companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company does not exist."));

        Subscription subscription = new Subscription();
        subscription.setId(new SubscriptionId(company, youtuber));
        subscription.setSubscriptionDate(new Date());
        subscription.setIsBlocked(false);

        this.subscriptionRepository.save(subscription);
        return ResponseEntity.ok(new MessageResponse("You have just subscribed for company."));
    }

    public ResponseEntity<Boolean> checkSubscription(Long youtuberId, Long companyId) {
        Boolean existSub = this.subscriptionRepository.existsById_Company_IdAndId_Youtuber_Id(companyId, youtuberId);
        return ResponseEntity.ok(existSub);
    }

    @Override
    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email) //TODO: repeated with other method...
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
    }

    @Override
    public Company findCompanyByEmail(String email) {
        return this.companyRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Company Not Found with email: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
        return user;
    }
}
