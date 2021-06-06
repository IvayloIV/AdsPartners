package com.tugab.adspartners.repository.customs;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdRepositoryCustom {

    public Page<Ad> findAllByFilters(AdFilterBindingModel filters, Pageable pageable);
}
