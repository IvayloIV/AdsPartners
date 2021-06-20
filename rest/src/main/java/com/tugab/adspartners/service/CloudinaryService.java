package com.tugab.adspartners.service;

import com.tugab.adspartners.domain.entities.CloudinaryResource;

public interface CloudinaryService {

    public CloudinaryResource uploadImage(String imageBase64);

    public CloudinaryResource updateImage(CloudinaryResource oldImage, String base64Image);

    public boolean deleteImageResource(CloudinaryResource image);

    public void deleteImage(CloudinaryResource image);
}
