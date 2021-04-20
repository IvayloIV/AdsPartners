package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.RegistrationStatus;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Table
@Entity(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;

    @Column(name = "income_last_year")
    private Double incomeLastYear;

    private String town;

    private String description;

    @Column(name = "workers_count")
    private Integer workersCount;

    @Column(name = "company_creation_date")
    private Date companyCreationDate;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;

    @Column(name = "status_modify_date")
    private Date statusModifyDate;

    @OneToOne(targetEntity = CloudinaryResource.class)
    @JoinColumn(name = "logo", referencedColumnName = "id", unique = true)
    private CloudinaryResource logo;

    @OneToOne(targetEntity = User.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "company", targetEntity = Ad.class)
    private List<Ad> ads;

    @Transient
    private Integer adsCount = 0;

    @Override
    public String toString() {
        return super.toString();
    }
}
