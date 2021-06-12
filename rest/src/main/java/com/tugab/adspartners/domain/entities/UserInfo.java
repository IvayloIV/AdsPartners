package com.tugab.adspartners.domain.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@MappedSuperclass
public abstract class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Transient
    private String token;
}
