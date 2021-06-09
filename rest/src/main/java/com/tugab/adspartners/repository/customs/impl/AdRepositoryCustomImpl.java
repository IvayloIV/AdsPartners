package com.tugab.adspartners.repository.customs.impl;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import com.tugab.adspartners.repository.customs.AdRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

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
            predicates.add(cb.ge(cb.coalesce(ad.get("reward"), 0), filters.getMinReward()));
        }

        if (filters.getMaxReward() != null) {
            predicates.add(cb.le(cb.coalesce(ad.get("reward"), 0), filters.getMaxReward()));
        }

        if (filters.getMinVideos() != null) {
            predicates.add(cb.ge(cb.coalesce(ad.get("minVideos"), 0), filters.getMinVideos()));
        }

        if (filters.getMaxVideos() != null) {
            predicates.add(cb.le(cb.coalesce(ad.get("minVideos"), 0), filters.getMaxVideos()));
        }

        if (filters.getMinSubscribers() != null) {
            predicates.add(cb.ge(cb.coalesce(ad.get("minSubscribers"), 0), filters.getMinSubscribers()));
        }

        if (filters.getMaxSubscribers() != null) {
            predicates.add(cb.le(cb.coalesce(ad.get("minSubscribers"), 0), filters.getMaxSubscribers()));
        }

        if (filters.getMinViews() != null) {
            predicates.add(cb.ge(cb.coalesce(ad.get("minViews"), 0), filters.getMinViews()));
        }

        if (filters.getMaxViews() != null) {
            predicates.add(cb.le(cb.coalesce(ad.get("minViews"), 0), filters.getMaxViews()));
        }

        if (filters.getStartCreationDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(ad.get("creationDate"), filters.getStartCreationDate()));
        }

        Calendar c = Calendar.getInstance();

        if (filters.getEndCreationDate() != null) {
            c.setTime(filters.getEndCreationDate());
            c.add(Calendar.DAY_OF_MONTH, 1);
            predicates.add(cb.lessThan(ad.get("creationDate"), c.getTime()));
        }

        if (filters.getStartValidTo() != null) {
            predicates.add(cb.greaterThanOrEqualTo(ad.get("validTo"), filters.getStartValidTo()));
        }

        if (filters.getEndValidTo() != null) {
            c.setTime(filters.getEndValidTo());
            c.add(Calendar.DAY_OF_MONTH, 1);
            predicates.add(cb.lessThan(ad.get("validTo"), c.getTime()));
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

    @Override
    @SuppressWarnings("unchecked")
    public List<Double> findAdRewards(FiltersBindingModel filtersBindingModel) {
        return (List<Double>) findGroupAdProp(filtersBindingModel, "reward");
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Long> findAdVideos(FiltersBindingModel filtersBindingModel) {
        return (List<Long>) findGroupAdProp(filtersBindingModel, "minVideos");
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Long> findAdSubscribers(FiltersBindingModel filtersBindingModel) {
        return (List<Long>) findGroupAdProp(filtersBindingModel, "minSubscribers");
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Long> findAdViews(FiltersBindingModel filtersBindingModel) {
        return (List<Long>) findGroupAdProp(filtersBindingModel, "minViews");
    }

    @Override
    public List<CompanyListResponse> findAdCompanies() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<CompanyListResponse> query = cb.createQuery(CompanyListResponse.class);
        Root<Ad> ad = query.from(Ad.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.isFalse(ad.get("isBlocked")));

        Path<Object> companyId = ad.get("company").get("id");
        Path<Object> companyName = ad.get("company").get("user").get("name");

        query.where(predicates.toArray(new Predicate[0]));
        query.groupBy(companyId, companyName);
        query.orderBy(cb.asc(companyName));
        query.multiselect(companyId, companyName);

        return this.entityManager.createQuery(query).getResultList();
    }

    private List<? extends Number> findGroupAdProp(FiltersBindingModel filtersBindingModel, String prop) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Ad> ad = query.from(Ad.class);

        List<Predicate> predicates = this.createFilters(cb, ad, filtersBindingModel);

        query.where(predicates.toArray(new Predicate[0]));
        query.groupBy(ad.get(prop));
        query.orderBy(cb.asc(ad.get(prop)));
        query.select(ad.get(prop));

        return this.entityManager.createQuery(query).getResultList();
    }

    private List<Predicate> createFilters(CriteriaBuilder cb, Root<Ad> ad, FiltersBindingModel filters) {
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.isFalse(ad.get("isBlocked")));

        if (filters.getCompanyId() != null) {
            predicates.add(cb.equal(ad.get("company").get("id"), filters.getCompanyId()));
        }

        if (filters.getTitle() != null) {
            predicates.add(cb.like(cb.lower(ad.get("title")), likeToLower(filters.getTitle())));
        }

        if (filters.getDescription() != null) {
            predicates.add(cb.like(cb.lower(ad.get("shortDescription")), likeToLower(filters.getDescription())));
        }

        return predicates;
    }

    private String likeToLower(String value) {
        return String.format("%%%s%%", value.toLowerCase());
    }
}
