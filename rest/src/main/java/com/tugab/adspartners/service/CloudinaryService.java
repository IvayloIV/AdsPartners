package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.CloudinaryResource;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    public CloudinaryResource uploadImage(String imageBase64);

    public CloudinaryResource uploadImage(MultipartFile image);

    public CloudinaryResource updateImage(CloudinaryResource oldImage, String base64Image);

    public CloudinaryResource updateImage(CloudinaryResource oldImage, MultipartFile newImage);

    public void deleteImage(CloudinaryResource image);
}
