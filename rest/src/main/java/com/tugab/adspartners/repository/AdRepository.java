package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.repository.customs.AdRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long>, AdRepositoryCustom {

    public Optional<Ad> findById(Long id);
}
