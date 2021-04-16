package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {

    @Query("select a from Ad a " +
            "where (a.company.id = :#{#adFilter.companyId} or :#{#adFilter.companyId} is null) " +
            " and (instr(lower(a.title), lower(:#{#adFilter.title})) > 0 or :#{#adFilter.title} is null) " +
            " and (instr(lower(a.shortDescription), lower(:#{#adFilter.description})) > 0 or :#{#adFilter.description} is null) " +
            " and (a.reward >= :#{#adFilter.minReward} or :#{#adFilter.minReward} is null) " +
            " and (a.reward <= :#{#adFilter.maxReward} or :#{#adFilter.maxReward} is null) " +
            " and (a.minVideos >= :#{#adFilter.minVideos} or :#{#adFilter.minVideos} is null) " +
            " and (a.minVideos <= :#{#adFilter.maxVideos} or :#{#adFilter.maxVideos} is null) " +
            " and (a.minSubscribers >= :#{#adFilter.minSubscribers} or :#{#adFilter.minSubscribers} is null) " +
            " and (a.minSubscribers <= :#{#adFilter.maxSubscribers} or :#{#adFilter.maxSubscribers} is null) " +
            " and (a.minViews >= :#{#adFilter.minViews} or :#{#adFilter.minViews} is null) " +
            " and (a.minViews <= :#{#adFilter.maxViews} or :#{#adFilter.maxViews} is null) " +
            " and (a.creationDate >= :#{#adFilter.startCreationDate} or :#{#adFilter.startCreationDate} is null) " +
            " and (a.creationDate <= :#{#adFilter.endCreationDate} or :#{#adFilter.endCreationDate} is null) " +
            " and (a.validTo >= :#{#adFilter.startValidTo} or :#{#adFilter.startValidTo} is null) " +
            " and (a.validTo <= :#{#adFilter.endValidTo} or :#{#adFilter.endValidTo} is null) ")
    public Page<Ad> findAll(@Param("adFilter") AdFilterBindingModel adFilterBindingModel, Pageable pageable);

    @Query("select a from Ad a " +
            "where (a.company.id = :#{#adFilter.companyId} or :#{#adFilter.companyId} is null) " +
            " and (instr(lower(a.title), lower(:#{#adFilter.title})) > 0 or :#{#adFilter.title} is null) " +
            " and (instr(lower(a.shortDescription), lower(:#{#adFilter.description})) > 0 or :#{#adFilter.description} is null) ")
    public List<Ad> findAllByFilters(@Param("adFilter") FiltersBindingModel filtersBindingModel);

    public Optional<Ad> findById(Long id);
}
