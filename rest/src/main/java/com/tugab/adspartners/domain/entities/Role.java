package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.Authority;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Authority authority;

    public Role(Authority authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return this.authority.name();
    }
}
