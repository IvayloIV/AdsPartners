package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.youtuber.YoutuberFilterBindingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface YoutuberRepository extends JpaRepository<Youtuber, Long> {

    public boolean existsByEmail(String email);

    public Youtuber findByEmail(String email);

    public Page<Youtuber> findAllByOrderBySubscriberCountDesc(Pageable pageable);
}
