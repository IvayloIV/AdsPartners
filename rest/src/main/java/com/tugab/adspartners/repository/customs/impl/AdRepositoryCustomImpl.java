package com.tugab.adspartners.repository.customs.impl;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.enums.RegistrationStatus;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.company.CompanyFilterBindingModel;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.repository.customs.AdRepositoryCustom;
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
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class AdRepositoryCustomImpl implements AdRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Ad> findAllByFilters(AdFilterBindingModel filters, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Ad> query = cb.createQuery(Ad.class);
        Root<Ad> ad = query.from(Ad.class);

        List<Predicate> predicates = new ArrayList<>();

        if (filters.getIsBlocked() != null) {
            predicates.add(cb.equal(ad.get("isBlocked"), filters.getIsBlocked()));
        }

        if (filters.getCompanyId() != null) {
            predicates.add(cb.equal(ad.get("company").get("id"), filters.getCompanyId()));
        }

        if (filters.getTitle() != null) {
            predicates.add(cb.like(cb.lower(ad.get("title")), likeToLower(filters.getTitle())));
        }

        if (filters.getDescription() != null) {
            predicates.add(cb.like(cb.lower(ad.get("shortDescription")), likeToLower(filters.getDescription())));
        }

        if (filters.getMinReward() != null) {
            predicates.add(cb.ge(ad.get("reward"), filters.getMinReward()));
        }

        if (filters.getMaxReward() != null) {
            predicates.add(cb.le(ad.get("reward"), filters.getMaxReward()));
        }

        if (filters.getMinVideos() != null) {
            predicates.add(cb.ge(ad.get("minVideos"), filters.getMinVideos()));
        }

        if (filters.getMaxVideos() != null) {
            predicates.add(cb.le(ad.get("minVideos"), filters.getMaxVideos()));
        }

        if (filters.getMinSubscribers() != null) {
            predicates.add(cb.ge(ad.get("minSubscribers"), filters.getMinSubscribers()));
        }

        if (filters.getMaxSubscribers() != null) {
            predicates.add(cb.le(ad.get("minSubscribers"), filters.getMaxSubscribers()));
        }

        if (filters.getMinViews() != null) {
            predicates.add(cb.ge(ad.get("minViews"), filters.getMinViews()));
        }

        if (filters.getMaxViews() != null) {
            predicates.add(cb.le(ad.get("minViews"), filters.getMaxViews()));
        }

        if (filters.getStartCreationDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(ad.get("creationDate"), filters.getStartCreationDate()));
        }

        if (filters.getEndCreationDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(ad.get("creationDate"), filters.getEndCreationDate()));
        }

        if (filters.getStartValidTo() != null) {
            predicates.add(cb.greaterThanOrEqualTo(ad.get("validTo"), filters.getStartValidTo()));
        }

        if (filters.getEndValidTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(ad.get("validTo"), filters.getEndValidTo()));
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.desc(ad.get("creationDate")));

        List<Ad> ads = this.entityManager
                .createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Ad> adsRootCount = countQuery.from(Ad.class);
        countQuery.select(cb.count(adsRootCount))
                .where(cb.and(predicates.toArray(new Predicate[0])));
        Long count = this.entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(ads, pageable, count);
    }

    private String likeToLower(String value) {
        return String.format("%%%s%%", value.toLowerCase());
    }
}
