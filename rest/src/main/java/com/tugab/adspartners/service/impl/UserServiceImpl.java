package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.ApplicationType;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyOfferBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.JwtResponse;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.MessagesResponse;
import com.tugab.adspartners.domain.models.response.company.*;
import com.tugab.adspartners.repository.*;
import com.tugab.adspartners.security.jwt.JwtUtils;
import com.tugab.adspartners.service.AdService;
import com.tugab.adspartners.service.CloudinaryService;
import com.tugab.adspartners.service.EmailService;
import com.tugab.adspartners.service.UserService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final AdRepository adRepository;
    private final YoutuberRepository youtuberRepository;
    private final AdApplicationRepository adApplicationRepository;
    private final ModelMapper modelMapper;
    private final JwtUtils jwtUtils;
    private final ResourceBundleUtil resourceBundleUtil;
    private final EmailService emailService;
    private final AdService adService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(CloudinaryService cloudinaryService,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           CompanyRepository companyRepository,
                           AdRepository adRepository,
                           YoutuberRepository youtuberRepository,
                           AdApplicationRepository adApplicationRepository,
                           ModelMapper modelMapper,
                           JwtUtils jwtUtils,
                           ResourceBundleUtil resourceBundleUtil,
                           EmailService emailService,
                           AdService adService) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.adRepository = adRepository;
        this.youtuberRepository = youtuberRepository;
        this.adApplicationRepository = adApplicationRepository;
        this.modelMapper = modelMapper;
        this.jwtUtils = jwtUtils;
        this.resourceBundleUtil = resourceBundleUtil;
        this.emailService = emailService;
        this.adService = adService;
    }

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel, Errors errors) {
        if (errors.hasErrors()) {
            List<String> errorMessages = errors.getAllErrors()
                    .stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new MessagesResponse(errorMessages), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (userRepository.existsByEmail(registerCompanyBindingModel.getUserEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessagesResponse(this.resourceBundleUtil.getMessage("registerCompany.emailNotExist")));
        }

        Company company = this.modelMapper.map(registerCompanyBindingModel, Company.class);
        company.setWorkersCount(registerCompanyBindingModel.getWorkersCount());
        CloudinaryResource cloudinaryResource = this.cloudinaryService.uploadImage(registerCompanyBindingModel.getLogoBase64());
        company.setLogo(cloudinaryResource);
        company.setStatus(RegistrationStatus.UNRESOLVED);

        User user = company.getUser();
        user.setPassword(this.passwordEncoder.encode(registerCompanyBindingModel.getUserPassword()));
        user.setCreatedDate(new Date());

        Role employerRole = this.roleRepository.findByAuthority(Authority.EMPLOYER).orElse(null);
        if (employerRole == null) {
            return new ResponseEntity<>(new MessagesResponse(this.resourceBundleUtil.getMessage("registerCompany.roleNotFound")),
                    HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user.addRole(employerRole);

        this.companyRepository.save(company);
        this.emailService.sendAfterCompanyRegistration(company, registerCompanyBindingModel.getAdminRedirectUrl());
        return ResponseEntity.ok(new MessageResponse(this.resourceBundleUtil.getMessage("registerCompany.success")));
    }

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel, Errors errors) {
        String companyEmail = loginCompanyBindingModel.getEmail();
        String companyPassword = loginCompanyBindingModel.getPassword();
        String badCredentialsKey = "companyLogin.badCredentials";
        Function<String, ResponseEntity<?>> checkCompanyStatus = email -> {
            Company company = this.companyRepository.findByUserEmail(email).orElse(null);
            if (company != null && !RegistrationStatus.ALLOWED.equals(company.getStatus())) {
                String badCompanyStatusMessage = this.resourceBundleUtil.getMessage("companyLogin.badCompanyStatus");
                return new ResponseEntity<>(new MessagesResponse(badCompanyStatusMessage), HttpStatus.UNAUTHORIZED);
            }
            return null;
        };

        return this.authenticateUser(companyEmail, companyPassword, errors, badCredentialsKey, checkCompanyStatus);
    }

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginAdminBindingModel, Errors errors) {
        String adminEmail = loginAdminBindingModel.getEmail();
        String adminPassword = loginAdminBindingModel.getPassword();
        String badCredentialsKey = "adminLogin.badCredentials";

        return this.authenticateUser(adminEmail, adminPassword, errors, badCredentialsKey, null);
    }

    private ResponseEntity<?> authenticateUser(String username, String password, Errors errors, String badCredentialsKey, Function<String, ResponseEntity<?>> checkCompanyStatus) {
        if (errors.hasErrors()) {
            List<String> errorMessages = errors.getAllErrors()
                    .stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new MessagesResponse(errorMessages), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Authentication authentication;

        try {
            authentication = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException ex) {
            String badCredentialsMessage = this.resourceBundleUtil.getMessage(badCredentialsKey);
            return new ResponseEntity<>(new MessagesResponse(badCredentialsMessage), HttpStatus.UNAUTHORIZED);
        }

        if (checkCompanyStatus != null) {
            ResponseEntity<?> responseEntity = checkCompanyStatus.apply(username);
            if (responseEntity != null) {
                return responseEntity;
            }
        }

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
    public ResponseEntity<?> getCompanyById(Long id) {
        Company company = this.companyRepository.findById(id).orElse(null);
        if (company == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("companyProfile.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        CompanyResponse companyResponse = this.modelMapper.map(company, CompanyResponse.class);
        companyResponse.setAdsCount(company.getAds().size());
        return ResponseEntity.ok(companyResponse);
    }

    @Override
    public ResponseEntity<List<CompanyRegisterRequestResponse>> getRegisterRequests() {
        List<Company> companies = this.companyRepository
                .findAllByStatusOrderByUser_CreatedDateDesc(RegistrationStatus.UNRESOLVED);
        
        List<CompanyRegisterRequestResponse> companiesRequest = companies.stream()
                .map(c -> this.modelMapper.map(c, CompanyRegisterRequestResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(companiesRequest);
    }

    @Override
    public ResponseEntity<List<CompanyRegisterHistoryResponse>> getRegisterHistory() {
        List<Company> companies = this.companyRepository
                .findAllByStatusNotOrderByStatusModifyDateDesc(RegistrationStatus.UNRESOLVED);

        List<CompanyRegisterHistoryResponse> companiesHistory = companies.stream()
                .map(c -> this.modelMapper.map(c, CompanyRegisterHistoryResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(companiesHistory);
    }

    @Override
    public ResponseEntity<?> updateCompanyStatus(Long companyId, UpdateStatusBindingModel updateStatusBindingModel) {
        Company company = this.companyRepository.findById(companyId).orElse(null);

        if (company == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("companyRequest.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        company.setStatus(updateStatusBindingModel.getStatus());
        company.setStatusModifyDate(new Date());
        this.companyRepository.save(company);
        this.emailService.sendCompanyStatusChanged(company.getUser().getEmail(), company.getStatus());

        CompanyRegisterHistoryResponse companyHistory = this.modelMapper
                .map(company, CompanyRegisterHistoryResponse.class);
        return ResponseEntity.ok(companyHistory);
    }

    @Override
    public ResponseEntity<List<CompanyInfoResponse>> getCompanyList(Integer size) {
        Pageable companyPageable = PageRequest.of(0, size);
        Page<Object[]> companiesPage = this.companyRepository.findTopCompaniesByRating(companyPageable);

        List<CompanyInfoResponse> companyInfoResponses = companiesPage
                .getContent()
                .stream()
                .map(o -> {
                    Company company = (Company) o[0];
                    Double averageRating = (Double) o[1];
                    CompanyInfoResponse companyInfo = this.modelMapper.map(company, CompanyInfoResponse.class);
                    companyInfo.setAverageRating(averageRating != null ? averageRating : 0.0);
                    return companyInfo;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(companyInfoResponses);
    }

    @Override
    public ResponseEntity<CompanyAdsListResponse> getCompaniesAds(CompanyFilterBindingModel companyFilterBindingModel) {
        int page = companyFilterBindingModel.getPage() - 1;
        Integer size = companyFilterBindingModel.getSize();
        Pageable companyPageable = PageRequest.of(page, size);

        Page<Company> companies = this.companyRepository.findAllByFilters(companyFilterBindingModel, companyPageable);

        List<CompanyAdsResponse> companiesResponse = companies
                .getContent()
                .stream()
                .map(c -> {
                    c.getAds().forEach(this.adService::setAdAverageRating);
                    return this.modelMapper.map(c, CompanyAdsResponse.class);
                })
                .collect(Collectors.toList());

        CompanyAdsListResponse companyAdsList = new CompanyAdsListResponse();
        companyAdsList.setItems(companiesResponse);
        companyAdsList.setElementsPerPage(companies.getNumberOfElements());
        companyAdsList.setTotalElements(companies.getTotalElements());
        companyAdsList.setTotalPages(companies.getTotalPages());

        return ResponseEntity.ok(companyAdsList);
    }

    @Override
    public ResponseEntity<CompanyFiltersResponse> getCompaniesFilters() {
        List<Long> adCounts = this.companyRepository.countAdsOfCompanies(RegistrationStatus.ALLOWED);
        CompanyFiltersResponse companyFilters = new CompanyFiltersResponse();
        companyFilters.setAdCounts(adCounts);
        return ResponseEntity.ok(companyFilters);
    }

    @Override
    public ResponseEntity<MessageResponse> companyOffer(CompanyOfferBindingModel companyOfferBindingModel, Company company) {
        final Long youtuberId = companyOfferBindingModel.getYoutuberId();
        final Long adId = companyOfferBindingModel.getAdId();

        Ad ad = this.adRepository.findById(adId).orElse(null);
        if (ad == null) {
            return new ResponseEntity<>(new MessageResponse("Ad not found."), HttpStatus.NOT_FOUND);
        }

        if (!ad.getCompany().getId().equals(company.getId())) {
            return new ResponseEntity<>(new MessageResponse("You are not owner of the ad."), HttpStatus.FORBIDDEN);
        }

        Youtuber youtuber = this.youtuberRepository.findById(youtuberId).orElse(null);

        if (youtuber == null) {
            return new ResponseEntity<>(new MessageResponse("Youtuber not found."), HttpStatus.NOT_FOUND);
        }

        if (ad.getApplicationList().stream().anyMatch(a -> a.getId().getYoutuber().getId().equals(youtuberId) && a.getId().getAd().getId().equals(adId))) {
            return new ResponseEntity<>(new MessageResponse("Youtuber already received offer or applied for this ad."), HttpStatus.FORBIDDEN);
        }

        AdApplication adApplication = new AdApplication();
        adApplication.setId(new AdApplicationId(ad, youtuber));
        adApplication.setDescription(companyOfferBindingModel.getDescription());
        adApplication.setApplicationDate(new Date());
        adApplication.setMailSent(false); //TODO: send mail here
        adApplication.setType(ApplicationType.COMPANY_SENT);

        this.adApplicationRepository.save(adApplication);
        return ResponseEntity.ok(new MessageResponse("You have just offered new partnership."));
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
