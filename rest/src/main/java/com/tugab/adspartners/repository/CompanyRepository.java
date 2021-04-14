package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    public Optional<Company> findByUserEmail(String email);

    public List<Company> findAllByOrderByUserName();
}
