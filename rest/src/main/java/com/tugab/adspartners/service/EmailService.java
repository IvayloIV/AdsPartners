package com.tugab.adspartners.service;

import java.util.Map;

public interface EmailService {

    public void sendMail(String template, String to, String subject);

    public String createTemplate(String templateName, Map<String, Object> variables);
}
