package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "subscription")
public class Subscription {

    @EmbeddedId
    private SubscriptionId id;

    @Column(name = "subscription_date", nullable = false)
    private Date subscriptionDate;

    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked;
}
