package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "ad_application")
public class AdApplication {

    @EmbeddedId
    private AdApplicationId id;

    private String description;

    @Column(name = "application_date", nullable = false)
    private Date applicationDate;
}
