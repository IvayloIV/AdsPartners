package com.tugab.adspartners.utils;

import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class DateTimeFormatter {

    private final static SimpleDateFormat dateTimeFormat = new SimpleDateFormat("dd-MM-yyyy hh:mm");
    private final static SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy hh:mm");

    public  String toDate(Date date) {
        return dateFormat.format(date);
    }

    public  String toDateTimeFormat(Date date) {
        return dateTimeFormat.format(date);
    }
}
