package com.tugab.adspartners.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class ResourceBundleUtil {

    private final MessageSource messageSource;

    @Autowired
    public ResourceBundleUtil(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return this.messageSource.getMessage(key, null, locale);
    }
}
