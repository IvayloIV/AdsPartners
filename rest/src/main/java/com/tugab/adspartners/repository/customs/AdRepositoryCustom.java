package com.tugab.adspartners.repository.customs;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.AdListFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.AdFiltersBindingModel;
import com.tugab.adspartners.domain.models.response.ad.filter.AdFilterCompanyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdRepositoryCustom {

    public Page<Ad> findAllByFilters(AdListFilterBindingModel filters, Pageable pageable);

    public List<Double> findAdRewards(AdFiltersBindingModel adFiltersBindingModel);

    public List<Long> findAdVideos(AdFiltersBindingModel adFiltersBindingModel);

    public List<Long> findAdSubscribers(AdFiltersBindingModel adFiltersBindingModel);

    public List<Long> findAdViews(AdFiltersBindingModel adFiltersBindingModel);

    public List<AdFilterCompanyResponse> findAdCompanies();
}
