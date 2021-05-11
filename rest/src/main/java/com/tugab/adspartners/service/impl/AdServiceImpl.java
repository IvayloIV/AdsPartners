package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.ApplicationType;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdApplicationResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.details.SubscriptionInfoResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdYoutuberApplicationResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.CreateRatingResponse;
import com.tugab.adspartners.repository.AdApplicationRepository;
import com.tugab.adspartners.repository.AdRatingRepository;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.repository.SubscriptionRepository;
import com.tugab.adspartners.service.AdService;
import com.tugab.adspartners.service.CloudinaryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final AdRatingRepository adRatingRepository;
    private final CloudinaryService cloudinaryService;
    private final AdApplicationRepository adApplicationRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public AdServiceImpl(AdRepository adRepository,
                         AdRatingRepository adRatingRepository,
                         CloudinaryService cloudinaryService,
                         AdApplicationRepository adApplicationRepository,
                         ModelMapper modelMapper) {
        this.adRepository = adRepository;
        this.adRatingRepository = adRatingRepository;
        this.cloudinaryService = cloudinaryService;
        this.adApplicationRepository = adApplicationRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel) {
        Pageable pageable = PageRequest.of(adFilterBindingModel.getPage() - 1, adFilterBindingModel.getSize());
        Page<Ad> pageAds = this.adRepository.findAll(adFilterBindingModel, pageable);
        //TODO: If youtuber make request, return only available ads, without blocked and out of date

        List<AdResponse> adsResponse = pageAds.getContent().stream()
                .map(this::setAdsCountToCompany)
                .map(this::setAdAverageRating)
                .map(a -> this.modelMapper.map(a, AdResponse.class))
                .collect(Collectors.toList());

        AdListResponse adListResponse = new AdListResponse();
        adListResponse.setItems(adsResponse);
        adListResponse.setElementsPerPage(pageAds.getSize());
        adListResponse.setTotalPages(pageAds.getTotalPages());
        adListResponse.setTotalElements(pageAds.getTotalElements());

        return ResponseEntity.ok(adListResponse);
    }

    private Ad setAdsCountToCompany(Ad ad) {
        Integer adsCount = ad.getCompany().getAds().size();
        ad.getCompany().setAdsCount(adsCount);
        return ad;
    }

    private Ad setAdAverageRating(Ad ad) {
        ad.getRatingList()
            .stream()
            .mapToInt(AdRating::getRating)
            .average()
            .ifPresent(ad::setAverageRating);

        return ad;
    }

    @Override
    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel) {
        final SimpleDateFormat formater = new SimpleDateFormat("dd/MM/yyyy");

        List<Ad> ads = this.adRepository.findAllByFilters(filtersBindingModel);
        FiltersResponse filtersResponse = new FiltersResponse();

        for (Ad ad : ads) {
            filtersResponse.getRewards().add(ad.getReward());
            try {
                filtersResponse.getCreatedDates().add(formater.parse(formater.format(ad.getCreationDate())));
                filtersResponse.getValidToDates().add(formater.parse(formater.format(ad.getValidTo())));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            filtersResponse.getMinVideos().add(ad.getMinVideos());
            filtersResponse.getMinSubscribers().add(ad.getMinSubscribers());
            filtersResponse.getMinViews().add(ad.getMinViews());
        }

        return ResponseEntity.ok(filtersResponse);
    }

    @Override
    public ResponseEntity<AdDetailsResponse> getDetails(Long adId) {
        Ad ad = this.adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid ad id."));
        this.setAdAverageRating(ad);

        AdDetailsResponse adResponse = this.modelMapper.map(ad, AdDetailsResponse.class);
        return ResponseEntity.ok(adResponse);
    }

    public ResponseEntity createAd(CreateAdBindingModel createAdBindingModel, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(errors.getFieldErrors());
        }

        CloudinaryResource picture = this.cloudinaryService.uploadImage(createAdBindingModel.getPictureBase64());

        Ad ad = this.modelMapper.map(createAdBindingModel, Ad.class);
        ad.setCreationDate(new Date());
        ad.setPicture(picture);
        ad.setIsBlocked(false);
        ad.getCharacteristics().forEach(c -> c.setAd(ad));
        this.adRepository.save(ad);
        return new ResponseEntity(new MessageResponse("Ad created successfully."), HttpStatus.CREATED);
    }

    public ResponseEntity<MessageResponse> editAd(EditAdBindingModel editAdBindingModel, Errors errors) {
        if (errors.hasErrors()) {
            String errorMessage = errors.getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining("\n"));

            return ResponseEntity.badRequest().body(new MessageResponse(errorMessage));
        }

        Ad ad = this.adRepository.findById(editAdBindingModel.getId())
                .orElseThrow(() -> new IllegalArgumentException("Illegal does not found."));
        CloudinaryResource oldAdPicture = null;

        if (editAdBindingModel.getPictureBase64() != null) {
            CloudinaryResource newPicture = this.cloudinaryService
                    .updateImage(ad.getPicture(), editAdBindingModel.getPictureBase64());

            if (newPicture != null) {
                oldAdPicture = ad.getPicture();
                ad.setPicture(newPicture);
            }
        }

        ad.setTitle(editAdBindingModel.getTitle());
        ad.setShortDescription(editAdBindingModel.getShortDescription());
        ad.setReward(editAdBindingModel.getReward());
        ad.setValidTo(editAdBindingModel.getValidTo());
        ad.setMinVideos(editAdBindingModel.getMinVideos());
        ad.setMinSubscribers(editAdBindingModel.getMinSubscribers());
        ad.setMinViews(editAdBindingModel.getMinViews());

        ad.getCharacteristics().clear();
        editAdBindingModel.getCharacteristics().forEach(c -> {
            c.setAd(ad);
            ad.getCharacteristics().add(c); //TODO: check if characteristic isn't belong to another ad
        });

        this.adRepository.save(ad);
        if (oldAdPicture != null) {
            this.cloudinaryService.deleteImage(oldAdPicture); //TODO: is it possible to remove picture at the same time with saving ad
        }

        return new ResponseEntity<>(new MessageResponse("Ad edited successfully."), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<MessageResponse> deleteAd(Long adId) {
        Ad ad = this.adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Ad does not found."));

        this.adRepository.delete(ad);
        this.cloudinaryService.deleteImageResource(ad.getPicture());

        return ResponseEntity.ok(new MessageResponse("Ad deleted successfully."));
    }

    public ResponseEntity<CreateRatingResponse> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber) {
        Ad ad = this.adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect ad id."));
        AdRating adRating = new AdRating();
        adRating.setId(new AdRatingId(ad, youtuber));
        adRating.setRating(ratingBindingModel.getRating());
        adRating.setCreationDate(new Date());
        this.adRatingRepository.save(adRating);

        CreateRatingResponse rating = this.modelMapper.map(adRating, CreateRatingResponse.class);
        rating.setAdId(ad.getId());
        rating.setYoutubeId(youtuber.getId());
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    public ResponseEntity<MessageResponse> applyFor(AdApplicationBindingModel adApplicationBindingModel) {
        Ad ad = this.adRepository.findById(adApplicationBindingModel.getAdId())
                .orElseThrow(() -> new IllegalArgumentException("Ad id does not exist."));
        Youtuber youtuber = adApplicationBindingModel.getYoutuber();

        AdApplication adApplication = new AdApplication();
        adApplication.setId(new AdApplicationId(ad, youtuber));
        adApplication.setDescription(adApplicationBindingModel.getDescription());
        adApplication.setApplicationDate(new Date());
        adApplication.setMailSent(false); //TODO: send mail here
        adApplication.setType(ApplicationType.YOUTUBER_SENT);

        this.adApplicationRepository.save(adApplication);
        return ResponseEntity.ok(new MessageResponse("You have just applied for ad."));
    }

    @Override
    public ResponseEntity<List<AdApplicationResponse>> getApplicationsByAdId(Long adId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Ad_Id(adId);
        List<AdApplicationResponse> adApplicationResponses = applications
                .stream()
                .map(a -> this.modelMapper.map(a, AdApplicationResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(adApplicationResponses);
    }

    @Override
    public ResponseEntity<List<AdApplicationResponse>> getApplicationsByCompanyId(Long companyId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Ad_Company_Id(companyId);
        List<AdApplicationResponse> adApplicationResponses = applications
                .stream()
                .map(a -> this.modelMapper.map(a, AdApplicationResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(adApplicationResponses);
    }

    @Override
    public ResponseEntity<List<AdApplicationResponse>> getApplicationsByYoutuber(Long youtuberId, Long companyId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Youtuber_IdAndId_Ad_Company_Id(youtuberId, companyId);
        List<AdApplicationResponse> adApplicationResponses = applications
                .stream()
                .map(a -> this.modelMapper.map(a, AdApplicationResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(adApplicationResponses);
    }

    @Override
    public ResponseEntity<List<AdYoutuberApplicationResponse>> getApplicationsByYoutuberId(Long youtuberId) {
        List<AdApplication> applications = this.adApplicationRepository.findById_Youtuber_Id(youtuberId);
        List<AdYoutuberApplicationResponse> adsResponse = applications
                .stream()
                .map(a -> {
                    AdYoutuberApplicationResponse adApplication =
                            this.modelMapper.map(a.getId().getAd(), AdYoutuberApplicationResponse.class);
                    adApplication.setType(a.getType().name());
                    return adApplication;
                }) //TODO: not the best way for AdYoutuberApplicationResponse
                .collect(Collectors.toList());

        return ResponseEntity.ok(adsResponse);
    }

    @Override
    public ResponseEntity<MessageResponse> changeAdBlockingStatus(Long adId, Boolean isBlocked) {
        Ad ad = this.adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Ad id does not exist."));
        ad.setIsBlocked(isBlocked);

        this.adRepository.save(ad);
        return ResponseEntity.ok(new MessageResponse("Status updated successfully."));
    }
}
