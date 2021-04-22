package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.LoginAdminBindingModel;
import com.tugab.adspartners.domain.models.binding.LoginCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.RegisterCompanyBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.SubscriberStatusBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyResponse;
import com.tugab.adspartners.domain.models.binding.company.UpdateStatusBindingModel;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyRegisterHistoryResponse;
import com.tugab.adspartners.domain.models.response.company.CompanyRegisterRequestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    public ResponseEntity<?> registerCompany(RegisterCompanyBindingModel registerCompanyBindingModel);

    public ResponseEntity<?> loginCompany(LoginCompanyBindingModel loginCompanyBindingModel);

    public User findByEmail(String email);

    public Company findCompanyByEmail(String email);

    public ResponseEntity<?> loginAdmin(LoginAdminBindingModel loginCompanyBindingModel);

    public ResponseEntity<List<CompanyListResponse>> getCompanyList();

    public ResponseEntity<CompanyResponse> getCompanyById(Long id);

    public ResponseEntity<List<SubscriptionInfoResponse>> getCompanySubscribers(Company company);

    public ResponseEntity<MessageResponse> changeSubscriberStatus(SubscriberStatusBindingModel subscriberStatusBindingModel);

    public ResponseEntity<MessageResponse> subscribe(Youtuber youtuber, Long companyId);

    public ResponseEntity<Boolean> checkSubscription(Long youtuberId, Long companyId);

    public ResponseEntity<List<CompanyRegisterRequestResponse>> getRegisterRequests();

    public ResponseEntity<List<CompanyRegisterHistoryResponse>> getRegisterHistory();

    public ResponseEntity<CompanyRegisterHistoryResponse> updateCompanyStatus(Long companyId, UpdateStatusBindingModel updateStatusBindingModel);
}
