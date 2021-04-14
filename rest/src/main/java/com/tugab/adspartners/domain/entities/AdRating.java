package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "ad_rating")
public class AdRating {

    @EmbeddedId
    private AdRatingId id;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "creation_date")
    private Date creationDate;
}
