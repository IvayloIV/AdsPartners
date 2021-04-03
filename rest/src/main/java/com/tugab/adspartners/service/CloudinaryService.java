package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.CloudinaryResource;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    public CloudinaryResource uploadImage(MultipartFile image);

    public boolean deleteImage(CloudinaryResource image);

    public CloudinaryResource updateImage(CloudinaryResource oldImage, MultipartFile newImage);
}
