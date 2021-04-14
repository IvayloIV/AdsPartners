package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.AdRating;
import com.tugab.adspartners.domain.entities.AdRatingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdRatingRepository extends JpaRepository<AdRating, AdRatingId> {
}
