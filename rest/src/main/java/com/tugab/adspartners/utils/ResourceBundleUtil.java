package com.tugab.adspartners.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.ResourceBundle;

@Component
public class ResourceBundleUtil {

    private final MessageSource messageSource;

    @Autowired
    public ResourceBundleUtil(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    private String getMessage(String key, Object[] params) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, params, locale);
    }

    public String getMessage(String key) {
        return this.getMessage(key, null);
    }

    public static String getBundleMessage(String key) { //Not the best practice
        Locale locale = LocaleContextHolder.getLocale();
        ResourceBundle rb = ResourceBundle.getBundle("locale/global", locale);
        return rb.getString(key);
    }
}
