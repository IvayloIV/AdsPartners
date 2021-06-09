package com.tugab.adspartners.service.impl;

import com.tugab.adspartners.domain.entities.*;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.domain.models.binding.ad.*;
import com.tugab.adspartners.domain.models.response.MessageResponse;
import com.tugab.adspartners.domain.models.response.MessagesResponse;
import com.tugab.adspartners.domain.models.response.ad.details.AdDetailsResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdListResponse;
import com.tugab.adspartners.domain.models.response.ad.list.AdResponse;
import com.tugab.adspartners.domain.models.response.ad.list.FiltersResponse;
import com.tugab.adspartners.domain.models.response.ad.rating.RatingResponse;
import com.tugab.adspartners.domain.models.response.youtuber.YoutuberRatingResponse;
import com.tugab.adspartners.repository.AdRatingRepository;
import com.tugab.adspartners.repository.AdRepository;
import com.tugab.adspartners.repository.CharacteristicRepository;
import com.tugab.adspartners.repository.SubscriptionRepository;
import com.tugab.adspartners.service.AdService;
import com.tugab.adspartners.service.CloudinaryService;
import com.tugab.adspartners.service.EmailService;
import com.tugab.adspartners.utils.ResourceBundleUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdServiceImpl implements AdService {

    private final AdRepository adRepository;
    private final AdRatingRepository adRatingRepository;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;
    private final ResourceBundleUtil resourceBundleUtil;
    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;
    private final CharacteristicRepository characteristicRepository;

    @Autowired
    public AdServiceImpl(AdRepository adRepository,
                         AdRatingRepository adRatingRepository,
                         CloudinaryService cloudinaryService,
                         ModelMapper modelMapper,
                         ResourceBundleUtil resourceBundleUtil,
                         SubscriptionRepository subscriptionRepository,
                         EmailService emailService,
                         CharacteristicRepository characteristicRepository) {
        this.adRepository = adRepository;
        this.adRatingRepository = adRatingRepository;
        this.cloudinaryService = cloudinaryService;
        this.modelMapper = modelMapper;
        this.resourceBundleUtil = resourceBundleUtil;
        this.characteristicRepository = characteristicRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.emailService = emailService;
    }

    @Override
    public ResponseEntity<AdListResponse> adsList(AdFilterBindingModel adFilterBindingModel, Authentication authentication) {
        Pageable pageable = PageRequest.of(adFilterBindingModel.getPage() - 1, adFilterBindingModel.getSize());
        boolean isYoutuber = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals(Authority.YOUTUBER.name()));

        if (isYoutuber) {
            adFilterBindingModel.setIsBlocked(false);
        }

        Page<Ad> pageAds = this.adRepository.findAllByFilters(adFilterBindingModel, pageable);

        List<AdResponse> adsResponse = pageAds.getContent().stream()
                .map(this::setAdsCountToCompany)
                .map(this::setAdAverageRating)
                .map(a -> this.modelMapper.map(a, AdResponse.class))
                .map(a -> this.setYoutuberApplication(a, isYoutuber, authentication))
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

    @Override
    public Ad setAdAverageRating(Ad ad) {
        ad.getRatingList()
            .stream()
            .mapToInt(AdRating::getRating)
            .average()
            .ifPresent(ad::setAverageRating);

        return ad;
    }

    private AdResponse setYoutuberApplication(AdResponse adResponse, Boolean isYoutuber, Authentication authentication) {
        if (isYoutuber) {
            Youtuber youtuber = (Youtuber) authentication.getPrincipal();
            AdRating adRating = this.adRatingRepository.findAllById_Ad_IdAndId_Youtuber_Id(adResponse.getId(), youtuber.getId())
                    .orElse(null);

            if (adRating != null) {
                RatingResponse ratingResponse = this.modelMapper.map(adRating, RatingResponse.class);
                adResponse.setRatingResponse(ratingResponse);
            }
        }

        return adResponse;
    }

    @Override
    public ResponseEntity<FiltersResponse> getFilters(FiltersBindingModel filtersBindingModel) {
        FiltersResponse filtersResponse = new FiltersResponse();
        filtersResponse.setCompanies(this.adRepository.findAdCompanies());
        filtersResponse.setRewards(this.adRepository.findAdRewards(filtersBindingModel));
        filtersResponse.setMinVideos(this.adRepository.findAdVideos(filtersBindingModel));
        filtersResponse.setMinSubscribers(this.adRepository.findAdSubscribers(filtersBindingModel));
        filtersResponse.setMinViews(this.adRepository.findAdViews(filtersBindingModel));

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

    public ResponseEntity<?> createAd(CreateAdBindingModel createAdBindingModel, Errors errors) {
        ResponseEntity<?> errorResponseEntity = this.checkForErrors(errors);
        if (errorResponseEntity != null) {
            return errorResponseEntity;
        }

        CloudinaryResource picture = this.cloudinaryService.uploadImage(createAdBindingModel.getPictureBase64());

        Ad ad = this.modelMapper.map(createAdBindingModel, Ad.class);
        ad.setCreationDate(new Date());
        ad.setPicture(picture);
        ad.setIsBlocked(false);
        ad.getCharacteristics().forEach(c -> c.setAd(ad));
        this.adRepository.save(ad);

        this.subscriptionRepository.findById_CompanyAndIsBlocked(ad.getCompany(),false)
            .forEach(s -> {
                String unsubscribeCompanyUrl = String.format("%s/company/%d/unsubscribe",
                        createAdBindingModel.getRemoteUrl(), ad.getCompany().getId());
                String youtuberEmail = s.getId().getYoutuber().getEmail();
                this.emailService.sendAdSubscription(ad, youtuberEmail, unsubscribeCompanyUrl);
            });

        MessageResponse responseMessage = new MessageResponse(this.resourceBundleUtil.getMessage("createAd.success"));
        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);
    }

    public ResponseEntity<?> editAd(EditAdBindingModel editAdBindingModel, Errors errors) {
        ResponseEntity<?> errorResponseEntity = this.checkForErrors(errors);
        if (errorResponseEntity != null) {
            return errorResponseEntity;
        }

        Ad ad = this.adRepository.findById(editAdBindingModel.getId()).orElse(null);
        if (ad == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("editAd.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        } else if (!ad.getCompany().getId().equals(editAdBindingModel.getCompany().getId())) {
            String wrongCompanyMessage = this.resourceBundleUtil.getMessage("editAd.wrongCompany");
            return new ResponseEntity<>(new MessagesResponse(wrongCompanyMessage), HttpStatus.FORBIDDEN);
        }

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

        List<String> errorCharMessages = new ArrayList<>();
        ad.getCharacteristics().clear();
        editAdBindingModel.getCharacteristics().forEach(c -> {
            if (c.getId() != null) {
                Characteristic savedChar = this.characteristicRepository.findById(c.getId()).orElse(null);
                if (savedChar == null) {
                    String charNotExist = this.resourceBundleUtil.getMessage("editAd.charNotExist");
                    errorCharMessages.add(charNotExist);
                } else if (!savedChar.getAd().getId().equals(ad.getId())) {
                    String charBelongToOtherAd = this.resourceBundleUtil.getMessage("editAd.charBelongToOtherAd");
                    errorCharMessages.add(charBelongToOtherAd);
                }
            }

            Characteristic characteristic = this.modelMapper.map(c, Characteristic.class);
            characteristic.setAd(ad);
            ad.getCharacteristics().add(characteristic);
        });

        if (errorCharMessages.size() != 0) {
            List<String> errorCharDistinctMessages = errorCharMessages.stream()
                .distinct()
                .collect(Collectors.toList());
            return new ResponseEntity<>(new MessagesResponse(errorCharDistinctMessages), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        this.adRepository.save(ad);
        if (oldAdPicture != null) {
            this.cloudinaryService.deleteImage(oldAdPicture);
        }

        return ResponseEntity.ok(new MessageResponse(this.resourceBundleUtil.getMessage("editAd.success")));
    }

    @Override
    public ResponseEntity<?> deleteAd(Long adId, Company company) {
        Ad ad = this.adRepository.findById(adId).orElse(null);

        if (ad == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("deleteAd.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        } else if (!ad.getCompany().getId().equals(company.getId())) {
            String wrongCompanyMessage = this.resourceBundleUtil.getMessage("deleteAd.wrongCompany");
            return new ResponseEntity<>(new MessagesResponse(wrongCompanyMessage), HttpStatus.FORBIDDEN);
        }

        this.adRepository.delete(ad);
        this.cloudinaryService.deleteImageResource(ad.getPicture());

        String successMessage = this.resourceBundleUtil.getMessage("deleteAd.success");
        return ResponseEntity.ok(new MessageResponse(successMessage));
    }

    public ResponseEntity<?> vote(Long adId, RatingBindingModel ratingBindingModel, Youtuber youtuber) {
        Boolean alreadyVote = this.adRatingRepository.existsById_Ad_IdAndId_Youtuber_Id(adId, youtuber.getId());
        if (alreadyVote) {
            String alreadyVoteMessage = this.resourceBundleUtil.getMessage("adList.alreadyVote");
            return new ResponseEntity<>(new MessagesResponse(alreadyVoteMessage), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Ad ad = this.adRepository.findById(adId).orElse(null);
        if (ad == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("adList.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        AdRating adRating = new AdRating();
        adRating.setId(new AdRatingId(ad, youtuber));
        adRating.setRating(ratingBindingModel.getRating());
        adRating.setCreationDate(new Date());
        adRating = this.adRatingRepository.save(adRating);

        RatingResponse rating = this.modelMapper.map(adRating, RatingResponse.class);
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> changeAdBlockingStatus(Long adId, Boolean isBlocked) {
        Ad ad = this.adRepository.findById(adId).orElse(null);
        if (ad == null) {
            String wrongIdMessage = this.resourceBundleUtil.getMessage("adStatus.wrongId");
            return new ResponseEntity<>(new MessagesResponse(wrongIdMessage), HttpStatus.NOT_FOUND);
        }

        if (ad.getIsBlocked() == isBlocked) {
            String wrongStatus = this.resourceBundleUtil.getMessage("adStatus.wrongStatus");
            return new ResponseEntity<>(new MessagesResponse(wrongStatus), HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        ad.setIsBlocked(isBlocked);
        this.adRepository.save(ad);

        String successMessage = this.resourceBundleUtil.getMessage("adStatus.success");
        return ResponseEntity.ok(new MessageResponse(successMessage));
    }

    private ResponseEntity<?> checkForErrors(Errors errors) {
        if (errors.hasErrors()) {
            List<String> errorMessages = errors.getAllErrors()
                    .stream()
                    .map(ObjectError::getDefaultMessage)
                    .distinct()
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new MessagesResponse(errorMessages), HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return null;
    }
}
