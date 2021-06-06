package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import com.tugab.adspartners.repository.customs.AdRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long>, AdRepositoryCustom {

    @Query("select a from Ad a " +
            "where (a.company.id = :#{#adFilter.companyId} or :#{#adFilter.companyId} is null) " +
            " and (instr(lower(a.title), lower(:#{#adFilter.title})) > 0 or :#{#adFilter.title} is null) " +
            " and (instr(lower(a.shortDescription), lower(:#{#adFilter.description})) > 0 or :#{#adFilter.description} is null) ")
    public List<Ad> findAllByFilters(@Param("adFilter") FiltersBindingModel filtersBindingModel);

    public Optional<Ad> findById(Long id);
}
