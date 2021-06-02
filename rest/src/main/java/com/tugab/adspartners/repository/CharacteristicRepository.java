package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Characteristic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
}
