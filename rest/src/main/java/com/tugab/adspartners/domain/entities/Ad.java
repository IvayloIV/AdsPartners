package com.tugab.adspartners.domain.entities;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "ad")
public class Ad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    @Length(min = 4, message = "Title cannot be less than 3 symbols.")
    private String title;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "reward", nullable = false)
    @NotNull(message = "Reward cannot be empty.")
    private Double reward;

    @Column(name = "creation_date", nullable = false)
    private Date creationDate;

    @Column(name = "valid_to", nullable = false)
    @NotNull(message = "Valid to cannot be empty.")
    private Date validTo;

    @Column(name = "min_videos")
    private Long minVideos;

    @Column(name = "min_subscribers")
    private Long minSubscribers;

    @Column(name = "min_views")
    private Long minViews;

    @Column(name = "is_blocked")
    private Boolean isBlocked;

    @ManyToOne(targetEntity = Company.class)
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne(targetEntity = CloudinaryResource.class, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "picture_id", referencedColumnName = "id")
    @NotNull(message = "Picture is required.")
    private CloudinaryResource picture;

    @OneToMany(mappedBy = "ad", targetEntity = Characteristic.class, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Characteristic> characteristics;

    @OneToMany(mappedBy = "id.ad", targetEntity = AdRating.class, cascade = CascadeType.ALL)
    private List<AdRating> ratingList;

    @OneToMany(mappedBy = "id.ad", targetEntity = AdApplication.class, cascade = CascadeType.ALL)
    private List<AdApplication> applicationList;

    @Transient
    private Double averageRating = 0.0;
}
