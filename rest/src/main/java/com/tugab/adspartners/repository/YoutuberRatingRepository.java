package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.YoutuberRating;
import com.tugab.adspartners.domain.entities.YoutuberRatingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YoutuberRatingRepository extends JpaRepository<YoutuberRating, YoutuberRatingId> {
}
