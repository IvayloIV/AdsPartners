package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.AdApplication;
import com.tugab.adspartners.domain.entities.AdApplicationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdApplicationRepository extends JpaRepository<AdApplication, AdApplicationId> {

    public List<AdApplication> findById_Ad_Id(Long adId);

    public List<AdApplication> findById_Youtuber_IdAndId_Ad_Company_Id(Long youtuberId, Long companyId);

    public AdApplication findById_Youtuber_IdAndId_Ad_Id(Long youtuberId, Long adId);
}
