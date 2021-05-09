package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "youtuber_rating")
public class YoutuberRating {

    @EmbeddedId
    private YoutuberRatingId id;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "creation_date")
    private Date creationDate;
}
