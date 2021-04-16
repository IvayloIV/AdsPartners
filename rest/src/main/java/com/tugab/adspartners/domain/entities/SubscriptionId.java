package com.tugab.adspartners.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionId implements Serializable {

    @ManyToOne(targetEntity = Ad.class)
    @JoinColumn(name = "ad_id", referencedColumnName = "id")
    private Ad ad;

    @ManyToOne(targetEntity = Youtuber.class)
    @JoinColumn(name = "youtuber_id", referencedColumnName = "id")
    private Youtuber youtuber;
}