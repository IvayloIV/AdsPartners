package com.tugab.adspartners.service.impl;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.tugab.adspartners.domain.entities.CloudinaryResource;
import com.tugab.adspartners.repository.CloudinaryRepository;
import com.tugab.adspartners.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.multipart.MultipartFile;
import static org.springframework.web.reactive.function.BodyInserters.FormInserter;

import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private static final String CLOUDINARY_BASE_URL = "https://api.cloudinary.com/v1_1/";

    @Value("${cloudinary.name}")
    private String cloudinaryName;

    @Value("${cloudinary.key}")
    private String cloudinaryKey;

    @Value("${cloudinary.secret}")
    private String cloudinarySecret;

    private final WebClient webClient;
    private final JsonParser jsonParser;
    private final CloudinaryRepository cloudinaryRepository;

    @Autowired
    public CloudinaryServiceImpl(WebClient webClient,
                            JsonParser jsonParser,
                            CloudinaryRepository cloudinaryRepository) {
        this.webClient = webClient;
        this.jsonParser = jsonParser;
        this.cloudinaryRepository = cloudinaryRepository;
    }

    @Override
    public CloudinaryResource uploadImage(MultipartFile image) {
        try {
            byte[] imageBytes = image.getBytes();
            String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
            String imageString = String.format("data:%s;base64,%s", image.getContentType(), imageBase64);
            return this.uploadImage(imageString);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public CloudinaryResource uploadImage(String imageBase64) {
        FormInserter<String> formInserter = this.createBody(null);
        formInserter = formInserter.with("file", imageBase64);

        WebClient.RequestHeadersSpec<?> requestHeadersSpec = this.webClient
                .method(HttpMethod.POST)
                .uri(CLOUDINARY_BASE_URL + this.cloudinaryName + "/image/upload")
                .body(formInserter);

        String responseBody = requestHeadersSpec.exchangeToMono(e -> e.bodyToMono(String.class)).block();
        JsonObject jsonData = this.jsonParser.parse(responseBody).getAsJsonObject();

        if (jsonData.has("asset_id")) {
            Instant createdAtInstant = Instant.parse(jsonData.get("created_at").getAsString());

            CloudinaryResource cloudinaryResource = new CloudinaryResource();
            cloudinaryResource.setId(jsonData.get("public_id").getAsString());
            cloudinaryResource.setSize(jsonData.get("bytes").getAsLong());
            cloudinaryResource.setFormat(jsonData.get("format").getAsString());
            cloudinaryResource.setResourceType(jsonData.get("resource_type").getAsString());
            cloudinaryResource.setCreatedAt(new Date(createdAtInstant.toEpochMilli()));
            cloudinaryResource.setUrl(jsonData.get("url").getAsString());

            this.cloudinaryRepository.save(cloudinaryResource);
            return cloudinaryResource;
        }

        return null;
    }

    @Override
    public CloudinaryResource updateImage(CloudinaryResource oldImage, String base64Image) {
        CloudinaryResource newCloudinaryResource = this.uploadImage(base64Image);
        if (newCloudinaryResource != null) {
            this.deleteImageResource(oldImage);
            return newCloudinaryResource;
        }

        return null;
    }

    @Override
    public CloudinaryResource updateImage(CloudinaryResource oldImage, MultipartFile newImage) {
        CloudinaryResource newCloudinaryResource = this.uploadImage(newImage);
        if (newCloudinaryResource != null) {
            this.deleteImageResource(oldImage);
            return newCloudinaryResource;
        }

        return null;
    }

    @Override
    public void deleteImage(CloudinaryResource image) {
        this.cloudinaryRepository.delete(image);
    }

    private boolean deleteImageResource(CloudinaryResource image) {
        TreeMap<String, String> params = new TreeMap<>();
        params.put("public_id", image.getId());

        FormInserter<String> formInserter = this.createBody(params);
        formInserter.with("public_id", image.getId());

        WebClient.RequestHeadersSpec<?> requestHeadersSpec = this.webClient
                .method(HttpMethod.POST)
                .uri(CLOUDINARY_BASE_URL + this.cloudinaryName + "/" + image.getResourceType() + "/destroy")
                .body(formInserter);

        String responseBody = requestHeadersSpec.exchangeToMono(e -> e.bodyToMono(String.class)).block();
        JsonObject jsonData = this.jsonParser.parse(responseBody).getAsJsonObject();

        if (jsonData.has("result") && jsonData.get("result").getAsString().equals("ok")) {
//            this.cloudinaryRepository.delete(image);
            return true;
        } else {
            return false;
        }
    }

    private FormInserter<String> createBody(TreeMap<String, String> params) {
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String signature = this.generateSignature(params, timestamp);

        return BodyInserters
            .fromFormData("api_key", this.cloudinaryKey)
            .with("timestamp", timestamp)
            .with("signature", signature);
    }

    private String generateSignature(TreeMap<String, String> params, String timestamp) {
        StringBuilder signatureBuilder = new StringBuilder();
        if (params != null) {
            params.forEach((k, v) -> signatureBuilder.append(String.format("%s=%s&", k, v)));
        }
        signatureBuilder.append(String.format("timestamp=%s%s", timestamp, this.cloudinarySecret));
        return DigestUtils.sha256Hex(signatureBuilder.toString());
    }
}
