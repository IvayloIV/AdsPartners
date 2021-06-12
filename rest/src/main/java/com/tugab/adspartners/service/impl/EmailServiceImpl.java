package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
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

    @Override
    public void sendAfterCompanyRegistration(Company company, String adminRedirectUrl) {
        final String mailSubject = this.resourceBundleUtil.getMessage("registerCompany.requestMailSubject");
        String template = this.createRegisterCompanyTemplate(company, adminRedirectUrl);
        Role adminRole = this.roleRepository.findByAuthority(Authority.ADMIN).orElse(null);

        if (adminRole != null) {
            List<User> admins = this.userRepository.findAllByRolesContains(adminRole);
            admins.forEach(a -> this.sendMail(template, a.getEmail(), mailSubject));
        }
    }

    @Override
    public void sendCompanyStatusChanged(String companyEmail, RegistrationStatus status) {
        final String mailSubject = this.resourceBundleUtil.getMessage("registerCompany.statusMailSubject");
        String template = this.createCompanyStatusChangedTemplate(status);
        this.sendMail(template, companyEmail, mailSubject);
    }

    @Override
    public void sendAdSubscription(Ad ad, String youtuberEmail, String unsubscribeCompanyUrl) {
        final String mailSubject = this.resourceBundleUtil.getMessage("createAd.mailSubject");
        String template = this.createAdSubscriptionTemplate(ad, unsubscribeCompanyUrl);
        this.sendMail(template, youtuberEmail, mailSubject);
    }

    @Override
    public void sendAdApplicationNotification(AdApplication adApplication) {
        final String mailSubject = this.resourceBundleUtil.getMessage("adDetails.mailSubject");
        final String companyEmail = adApplication.getId().getAd().getCompany().getUser().getEmail();
        String template = this.createAdApplicationTemplate(adApplication);
        this.sendMail(template, companyEmail, mailSubject);
    }

    private String createCompanyStatusChangedTemplate(RegistrationStatus status) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("requestAllowed", RegistrationStatus.ALLOWED.equals(status));
        return this.createTemplate("companyStatusChange", variables);
    }

    private String createRegisterCompanyTemplate(Company company, String adminRedirectUrl) {
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

        return this.createTemplate("companyRegister", variables);
    }

    private String createAdSubscriptionTemplate(Ad ad, String unsubscribeCompanyUrl) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("companyName", ad.getCompany().getUser().getName());
        variables.put("adPictureUrl", ad.getPicture().getUrl());
        variables.put("adTitle", ad.getTitle());
        variables.put("adDescription", ad.getDescription()); //TODO: maybe i should reduce letters to 50
        variables.put("adReward", String.format("%.2f", ad.getReward()));
        variables.put("adValidTo", this.dateTimeFormatter.toDate(ad.getValidTo()));
        variables.put("adMinVideos", ad.getMinVideos());
        variables.put("adMinSubscribers", ad.getMinSubscribers());
        variables.put("adMinViews", ad.getMinViews());
        variables.put("adCharacteristics", ad.getCharacteristics());
        variables.put("unsubscribeCompanyUrl", unsubscribeCompanyUrl);

        return this.createTemplate("adSubscribers", variables);
    }

    private String createAdApplicationTemplate(AdApplication adApplication) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("adImage", adApplication.getId().getAd().getPicture().getUrl());
        variables.put("adTitle", adApplication.getId().getAd().getTitle());
        variables.put("youtuberPicture", adApplication.getId().getYoutuber().getProfilePicture());
        variables.put("youtuberName", adApplication.getId().getYoutuber().getName());
        variables.put("youtuberEmail", adApplication.getId().getYoutuber().getEmail());
        variables.put("youtuberVideos", adApplication.getId().getYoutuber().getVideoCount());
        variables.put("youtuberSubs", adApplication.getId().getYoutuber().getSubscriberCount());
        variables.put("youtuberViews", adApplication.getId().getYoutuber().getViewCount());
        variables.put("adAppDescription", adApplication.getDescription());
        variables.put("youtuberChannelId", adApplication.getId().getYoutuber().getChannelId());

        return this.createTemplate("adApplication", variables);
    }
}
