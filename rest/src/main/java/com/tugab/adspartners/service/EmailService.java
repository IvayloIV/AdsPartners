package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.Company;

import java.util.Map;

public interface EmailService {

    public void sendMail(String template, String to, String subject);

    public String createTemplate(String templateName, Map<String, Object> variables);

    public void sendAfterCompanyRegistration(Company company, String adminRedirectUrl);
}
