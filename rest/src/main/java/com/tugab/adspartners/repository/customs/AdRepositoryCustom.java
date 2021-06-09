package com.tugab.adspartners.repository.customs;

import com.tugab.adspartners.domain.entities.Ad;
import com.tugab.adspartners.domain.models.binding.ad.AdFilterBindingModel;
import com.tugab.adspartners.domain.models.binding.ad.FiltersBindingModel;
import com.tugab.adspartners.domain.models.response.company.CompanyListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdRepositoryCustom {

    public Page<Ad> findAllByFilters(AdFilterBindingModel filters, Pageable pageable);

    public List<Double> findAdRewards(FiltersBindingModel filtersBindingModel);

    public List<Long> findAdVideos(FiltersBindingModel filtersBindingModel);

    public List<Long> findAdSubscribers(FiltersBindingModel filtersBindingModel);

    public List<Long> findAdViews(FiltersBindingModel filtersBindingModel);

    public List<CompanyListResponse> findAdCompanies();
}
