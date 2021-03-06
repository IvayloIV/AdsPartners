package com.tugab.adspartners.repository.customs;

import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.models.binding.company.CompanyFiltersBindingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyRepositoryCustom {

    public Page<Company> findAllByFilters(CompanyFiltersBindingModel filters, Pageable pageable);
}
