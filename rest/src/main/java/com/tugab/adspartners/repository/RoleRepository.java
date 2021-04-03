package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Role;
import com.tugab.adspartners.domain.enums.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByAuthority(Authority name);
}
