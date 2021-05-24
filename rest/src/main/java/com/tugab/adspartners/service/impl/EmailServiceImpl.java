package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Role;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.repository.RoleRepository;
import com.tugab.adspartners.repository.UserRepository;
import com.tugab.adspartners.service.EmailService;
import com.tugab.adspartners.utils.DateTimeFormatter;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;
    private final JavaMailSender javaMailSender;
    private final DateTimeFormatter dateTimeFormatter;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ResourceBundleUtil resourceBundleUtil;

    public EmailServiceImpl(TemplateEngine templateEngine,
                            JavaMailSender javaMailSender,
                            DateTimeFormatter dateTimeFormatter,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            ResourceBundleUtil resourceBundleUtil) {
        this.templateEngine = templateEngine;
        this.javaMailSender = javaMailSender;
        this.dateTimeFormatter = dateTimeFormatter;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.resourceBundleUtil = resourceBundleUtil;
    }

    public void sendMail(String template, String to, String subject) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        try {
            helper.setText(template, true);
            helper.setSubject(subject);
            helper.setTo(to);
        } catch (MessagingException e) {
            e.printStackTrace(); //TODO: do something with that exception
        }
        javaMailSender.send(mimeMessage);
    }

    public String createTemplate(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        if (variables != null) {
            variables.forEach(context::setVariable);
        }

        String template = String.format("mails/%s", templateName);
        return templateEngine.process(template, context);
    }

    public void sendAfterCompanyRegistration(Company company, String adminRedirectUrl) {
        final String mailSubject = this.resourceBundleUtil.getMessage("registerCompany.mailSubject");
        String template = this.createRegisterCompanyTemplate("companyRegister", company, adminRedirectUrl);
        Role adminRole = this.roleRepository.findByAuthority(Authority.ADMIN).orElse(null);

        if (adminRole != null) {
            List<User> admins = this.userRepository.findAllByRolesContains(adminRole);
            admins.forEach(a -> this.sendMail(template, a.getEmail(), mailSubject));
        }
    }

    private String createRegisterCompanyTemplate(String templateName, Company company, String adminRedirectUrl) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("requestDate", this.dateTimeFormatter.toDateTimeFormat(company.getUser().getCreatedDate()));
        variables.put("logoUrl", company.getLogo().getUrl());
        variables.put("userEmail", company.getUser().getEmail());
        variables.put("userName", company.getUser().getName());
        variables.put("phone", company.getPhone());
        variables.put("town", company.getTown());
        variables.put("description", company.getDescription());
        variables.put("workersCount", company.getWorkersCount());
        variables.put("incomeLastYear", company.getIncomeLastYear());
        variables.put("companyCreationDate", this.dateTimeFormatter.toDate(company.getCompanyCreationDate()));
        variables.put("processRequestUrl", adminRedirectUrl);

        return this.createTemplate(templateName, variables);
    }
}
