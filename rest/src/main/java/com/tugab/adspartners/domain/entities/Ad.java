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
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "reward", nullable = false)
    private Double reward;

    @Column(name = "creation_date", nullable = false)
    private Date creationDate;

    @Column(name = "valid_to", nullable = false)
    private Date validTo;

    @Column(name = "min_videos")
    private Long minVideos;

    @Column(name = "min_subscribers")
    private Long minSubscribers;

    @Column(name = "min_views")
    private Long minViews;

    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked;

    @ManyToOne(targetEntity = Company.class)
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne(targetEntity = CloudinaryResource.class, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "picture_id", referencedColumnName = "id")
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
