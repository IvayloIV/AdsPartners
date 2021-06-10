package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.AdApplication;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.enums.RegistrationStatus;

import java.util.Map;

public interface EmailService {

    public void sendMail(String template, String to, String subject);

    public String createTemplate(String templateName, Map<String, Object> variables);

    public void sendAfterCompanyRegistration(Company company, String adminRedirectUrl);

    public void sendCompanyStatusChanged(String companyEmail, RegistrationStatus status);

    public void sendAdSubscription(Ad ad, String youtuberEmail, String unsubscribeCompanyUrl);

    public void sendAdApplicationNotification(AdApplication adApplication);
}
