package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.Subscription;
import com.tugab.adspartners.domain.entities.SubscriptionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, SubscriptionId> {

    public List<Subscription> findById_Company(Company company);

    public Optional<Subscription> findById_Company_IdAndId_Youtuber_Id(Long companyId, Long YoutuberId);
}
