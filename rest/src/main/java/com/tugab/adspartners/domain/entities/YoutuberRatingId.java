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
public class YoutuberRatingId implements Serializable {

    @ManyToOne(targetEntity = Youtuber.class)
    @JoinColumn(name = "youtuber_id", referencedColumnName = "id")
    private Youtuber youtuber;

    @ManyToOne(targetEntity = Company.class)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;
}
