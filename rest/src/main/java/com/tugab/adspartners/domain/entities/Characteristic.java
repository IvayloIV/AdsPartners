package com.tugab.adspartners.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "characteristic")
public class Characteristic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @Length(min = 3, message = "Name of characteristic cannot be less than 3 symbols.")
    private String name;

    @Column(name = "value")
    @Length(min = 1, message = "Value of characteristic cannot be less than 1 symbols.")
    private String value;

    @JsonIgnore
    @ManyToOne(targetEntity = Ad.class)
    @JoinColumn(name = "ad_id", referencedColumnName = "id")
    private Ad ad;
}
