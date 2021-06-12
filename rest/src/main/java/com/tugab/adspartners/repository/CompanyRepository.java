package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.repository.customs.CompanyRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long>, CompanyRepositoryCustom {

    public Optional<Company> findByUserEmail(String email);

    public List<Company> findAllByStatusOrderByUser_CreatedDateDesc(RegistrationStatus status);

    public List<Company> findAllByStatusNotOrderByStatusModifyDateDesc(RegistrationStatus status);

    @Query("select c as Company, " +
            " avg(ar.rating) as averageRating from AdRating ar " +
            " right join ar.id.ad.company as c" +
            " group by c.id" +
            " order by avg(ar.rating) desc")
    public Page<Object[]> findTopCompaniesByRating(Pageable pageable);

    @Query("select distinct size(c.ads)" +
            " from Company c " +
            " where c.status = :status" +
            " order by size(c.ads)")
    public List<Long> countAdsOfCompanies(@Param("status") RegistrationStatus registrationStatus);
}
