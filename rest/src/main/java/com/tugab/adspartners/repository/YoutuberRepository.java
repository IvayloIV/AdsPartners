package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.entities.Youtuber;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.youtuber.YoutuberFilterBindingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YoutuberRepository extends JpaRepository<Youtuber, Long> {

    public boolean existsByEmail(String email);

    public Youtuber findByEmail(String email);

    public Page<Youtuber> findAllByOrderBySubscriberCountDesc(Pageable pageable);

    @Query("select y from Youtuber y " +
            "where (instr(lower(y.name), lower(:#{#youtuberFilter.name})) > 0 or :#{#youtuberFilter.name} is null) " +
            " and (instr(lower(y.description), lower(:#{#youtuberFilter.description})) > 0 or :#{#youtuberFilter.description} is null) " +
            " and (y.subscriberCount >= :#{#youtuberFilter.minSubscriberCount} or :#{#youtuberFilter.minSubscriberCount} is null) " +
            " and (y.subscriberCount <= :#{#youtuberFilter.maxSubscriberCount} or :#{#youtuberFilter.maxSubscriberCount} is null) " +
            " and (y.videoCount >= :#{#youtuberFilter.minVideoCount} or :#{#youtuberFilter.minVideoCount} is null) " +
            " and (y.videoCount <= :#{#youtuberFilter.maxVideoCount} or :#{#youtuberFilter.maxVideoCount} is null) " +
            " and (y.viewCount >= :#{#youtuberFilter.minViewCount} or :#{#youtuberFilter.minViewCount} is null) " +
            " and (y.viewCount <= :#{#youtuberFilter.maxViewCount} or :#{#youtuberFilter.maxViewCount} is null) " +
            " and (y.publishedAt >= :#{#youtuberFilter.startPublishedAt} or :#{#youtuberFilter.startPublishedAt} is null) " +
            " and (y.publishedAt <= :#{#youtuberFilter.endPublishedAt} or :#{#youtuberFilter.endPublishedAt} is null) ")
    public Page<Youtuber> findAll(@Param("youtuberFilter") YoutuberFilterBindingModel youtuberFilterBindingModel, Pageable pageable);
}
