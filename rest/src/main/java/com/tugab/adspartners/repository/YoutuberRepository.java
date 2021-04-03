package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Youtuber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YoutuberRepository extends JpaRepository<Youtuber, Long> {

    public boolean existsByEmail(String email);

    public Youtuber findByEmail(String email);
}
