package com.tugab.adspartners.service.impl;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.tugab.adspartners.domain.entities.CloudinaryResource;
import com.tugab.adspartners.repository.CloudinaryRepository;
import com.tugab.adspartners.service.CloudinaryService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private static final String CLOUDINARY_BASE_URL = "https://api.cloudinary.com/v1_1/";

    private final RestTemplate restTemplate;
    private final Gson gson;
    private final JsonParser jsonParser;
    private final CloudinaryRepository cloudinaryRepository;

    @Value("${cloudinary.name}")
    private String cloudinaryName;

    @Value("${cloudinary.key}")
    private String cloudinaryKey;

    @Value("${cloudinary.secret}")
    private String cloudinarySecret;

    @Autowired
    public CloudinaryServiceImpl(RestTemplate restTemplate,
                                Gson gson,
                                JsonParser jsonParser,
                                CloudinaryRepository cloudinaryRepository) {
        this.restTemplate = restTemplate;
        this.gson = gson;
        this.jsonParser = jsonParser;
        this.cloudinaryRepository = cloudinaryRepository;
    }

    @Override
    public CloudinaryResource uploadImage(String imageBase64) {
        Map<String, String> bodyMap = this.createBodyMap(null);
        bodyMap.put("file", imageBase64);
        String body = this.gson.toJson(bodyMap);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = this.restTemplate.postForEntity(
            CLOUDINARY_BASE_URL + this.cloudinaryName + "/image/upload",
            httpEntity,
            String.class
        );

        if (responseEntity.getStatusCode().equals(HttpStatus.OK) && responseEntity.getBody() != null) {
            JsonObject jsonData = this.jsonParser.parse(responseEntity.getBody()).getAsJsonObject();

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
    public boolean deleteImageResource(CloudinaryResource image) {
        TreeMap<String, String> params = new TreeMap<>();
        params.put("public_id", image.getId());

        Map<String, String> bodyMap = this.createBodyMap(params);
        bodyMap.put("public_id", image.getId());
        String body = this.gson.toJson(bodyMap);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = this.restTemplate.postForEntity(
                CLOUDINARY_BASE_URL + this.cloudinaryName + "/" + image.getResourceType() + "/destroy",
                httpEntity,
                String.class
        );

        if (responseEntity.getStatusCode().equals(HttpStatus.OK) && responseEntity.getBody() != null) {
            JsonObject jsonData = this.jsonParser.parse(responseEntity.getBody()).getAsJsonObject();
            return jsonData.has("result") && jsonData.get("result").getAsString().equals("ok");
        }

        return false;
    }

    @Override
    public void deleteImage(CloudinaryResource image) {
        this.cloudinaryRepository.delete(image);
    }

    private Map<String, String> createBodyMap(TreeMap<String, String> params) {
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String signature = this.generateSignature(params, timestamp);

        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("api_key", this.cloudinaryKey);
        jsonMap.put("timestamp", timestamp);
        jsonMap.put("signature", signature);

        return jsonMap;
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
