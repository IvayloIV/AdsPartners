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
public class AdRatingId implements Serializable {

    @ManyToOne(targetEntity = Ad.class)
    @JoinColumn(name = "ad_id", referencedColumnName = "id", nullable = false)
    private Ad ad;

    @ManyToOne(targetEntity = Youtuber.class)
    @JoinColumn(name = "youtuber_id", referencedColumnName = "id", nullable = false)
    private Youtuber youtuber;
}
