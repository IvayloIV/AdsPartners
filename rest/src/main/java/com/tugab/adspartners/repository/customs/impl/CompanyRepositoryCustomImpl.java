package com.tugab.adspartners.repository.customs.impl;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.domain.models.binding.company.CompanyFilterBindingModel;
import com.tugab.adspartners.repository.customs.CompanyRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CompanyRepositoryCustomImpl implements CompanyRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Company> findAllByFilters(CompanyFilterBindingModel filters, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Company> query = cb.createQuery(Company.class);
        Root<Company> company = query.from(Company.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(company.get("status"), RegistrationStatus.ALLOWED));

        if (filters.getName() != null) {
            predicates.add(cb.like(cb.lower(company.get("user").get("name")), likeToLower(filters.getName())));
        }

        if (filters.getEmail() != null) {
            predicates.add(cb.like(cb.lower(company.get("user").get("email")), likeToLower(filters.getEmail())));
        }

        if (filters.getTown() != null) {
            predicates.add(cb.like(cb.lower(company.get("town")), likeToLower(filters.getTown())));
        }

        if (filters.getMinAdsCount() != null) {
            predicates.add(cb.ge(cb.size(company.get("ads")), filters.getMinAdsCount()));
        }

        if (filters.getMaxAdsCount() != null) {
            predicates.add(cb.le(cb.size(company.get("ads")), filters.getMaxAdsCount()));
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.desc(company.get("statusModifyDate")));

        List<Company> companies = this.entityManager
                .createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        companies.forEach(c -> c.setAdsCount(c.getAds().size()));
        if (filters.getIsBlocked() != null) {
            companies.forEach(c -> c.setAds(c.getAds()
                    .stream()
                    .filter(a -> a.getIsBlocked() == filters.getIsBlocked())
                    .collect(Collectors.toList()))
            );
        }

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Company> companiesRootCount = countQuery.from(Company.class);
        countQuery.select(cb.count(companiesRootCount))
                .where(cb.and(predicates.toArray(new Predicate[0])));
        Long count = this.entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(companies, pageable, count);
    }

    private String likeToLower(String value) {
        return String.format("%%%s%%", value.toLowerCase());
    }
}
