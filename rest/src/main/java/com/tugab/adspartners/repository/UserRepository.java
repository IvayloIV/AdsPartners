package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Role;
import com.tugab.adspartners.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByName(String name);

    Optional<User> findByEmail(String email);

    Boolean existsByName(String name);

    Boolean existsByEmail(String email);

    List<User> findAllByRolesContains(Role role);
}
