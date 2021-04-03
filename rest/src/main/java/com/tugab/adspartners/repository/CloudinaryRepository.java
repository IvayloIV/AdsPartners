package com.tugab.adspartners.repository;

import com.tugab.adspartners.domain.entities.CloudinaryResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CloudinaryRepository extends JpaRepository<CloudinaryResource, String> {
}
