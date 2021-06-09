package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.AdRating;
import com.tugab.adspartners.domain.entities.AdRatingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdRatingRepository extends JpaRepository<AdRating, AdRatingId> {

    public Optional<AdRating> findAllById_Ad_IdAndId_Youtuber_Id(Long adId, Long youtuberId);

    public Boolean existsById_Ad_IdAndId_Youtuber_Id(Long adId, Long youtuberId);
}
