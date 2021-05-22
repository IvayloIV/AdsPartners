package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.ApplicationType;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyOfferBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.JwtResponse;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.MessagesResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.company.*;
import com.tugab.adspartners.repository.*;
import com.tugab.adspartners.security.jwt.JwtUtils;
import com.tugab.adspartners.service.CloudinaryService;
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
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AdRepository adRepository;
    private final YoutuberRepository youtuberRepository;
    private final AdApplicationRepository adApplicationRepository;
    private final ModelMapper modelMapper;
    private final JwtUtils jwtUtils;
    private final ResourceBundleUtil resourceBundleUtil;

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
                           AdRepository adRepository,
                           YoutuberRepository youtuberRepository,
                           AdApplicationRepository adApplicationRepository,
                           ModelMapper modelMapper,
                           JwtUtils jwtUtils,
                           ResourceBundleUtil resourceBundleUtil) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.adRepository = adRepository;
        this.youtuberRepository = youtuberRepository;
        this.adApplicationRepository = adApplicationRepository;
        this.modelMapper = modelMapper;
        this.jwtUtils = jwtUtils;
        this.resourceBundleUtil = resourceBundleUtil;
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
        return ResponseEntity.ok(new MessageResponse(this.resourceBundleUtil.getMessage("registerCompany.success")));
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
    public ResponseEntity<CompanyRegisterHistoryResponse> updateCompanyStatus(Long companyId, UpdateStatusBindingModel updateStatusBindingModel) {
        Company company = this.companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid company id."));

        company.setStatus(updateStatusBindingModel.getStatus());
        company.setStatusModifyDate(new Date());
        this.companyRepository.save(company);

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
        Boolean isBlocked = companyFilterBindingModel.getIsBlocked();
        Pageable companyPageable = PageRequest.of(page, size);
        Page<Company> companies = this.companyRepository.findAllByFilters(companyFilterBindingModel, companyPageable);

        List<CompanyAdsResponse> companiesResponse = companies
                .getContent()
                .stream()
                .map(c -> this.modelMapper.map(c, CompanyAdsResponse.class))
                .map(c -> {
                    c.setTotalAdsCount(c.getAds().size());
                    if (isBlocked != null) { //TODO: make it with sql query
                        c.setAds(c.getAds()
                                .stream()
                                .filter(a -> a.getIsBlocked() == isBlocked)
                                .collect(Collectors.toList()));
                    }
                    return c;
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
        List<Company> companies = this.companyRepository.findAll();

        Set<Integer> adCounts = companies
            .stream()
            .map(c -> c.getAds().size())
            .collect(Collectors.toCollection(TreeSet::new));

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
