package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Table
@Entity(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer workersCount;

    @OneToOne(targetEntity = CloudinaryResource.class)
    @JoinColumn(name = "logo", referencedColumnName = "id", unique = true)
    private CloudinaryResource logo;

    @OneToOne(targetEntity = User.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //TODO: more fields here...
}
