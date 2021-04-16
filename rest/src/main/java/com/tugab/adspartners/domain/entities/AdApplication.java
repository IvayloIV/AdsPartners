package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.ApplicationType;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "ad_application")
public class AdApplication {

    @EmbeddedId
    private AdApplicationId id;

    private String description;

    @Column(name = "application_date")
    private Date applicationDate;

    @Column(name = "mail_sent")
    private Boolean mailSent;

    @Enumerated(EnumType.STRING)
    private ApplicationType type;
}
