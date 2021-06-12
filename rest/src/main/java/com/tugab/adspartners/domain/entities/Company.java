package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.RegistrationStatus;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "company")
public class Company {

    @Id
    private Long id;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "income_last_year")
    private Double incomeLastYear;

    @Column(name = "town", nullable = false)
    private String town;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "workers_count")
    private Integer workersCount;

    @Column(name = "company_creation_date", nullable = false)
    private Date companyCreationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RegistrationStatus status;

    @Column(name = "status_modify_date")
    private Date statusModifyDate;

    @OneToOne(targetEntity = CloudinaryResource.class)
    @JoinColumn(name = "logo", referencedColumnName = "id", nullable = false)
    private CloudinaryResource logo;

    @MapsId
    @OneToOne(targetEntity = User.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "company", targetEntity = Ad.class, fetch = FetchType.EAGER)
    private List<Ad> ads;

    @Transient
    private Integer adsCount = 0;

    @Override
    public String toString() {
        return super.toString();
    }
}
