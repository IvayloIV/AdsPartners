package com.tugab.adspartners.domain.models.binding.ad;

import com.tugab.adspartners.domain.entities.Company;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.Valid;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Future;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
public class CreateAdBindingModel {

    @Length(min = 3, max = 256, message = "{createAd.titleLength}")
    private String title;

    @Length(max = 1024, message = "{createAd.descriptionLength}")
    private String description;

    @NotNull(message = "{createAd.nullReward}")
    @DecimalMin(value = "0.01", message = "{createAd.negativeReward}")
    private Double reward;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "{createAd.nullValidTo}")
    @Future(message = "{createAd.validToFuture}")
    private Date validTo;

    @Min(value = 0, message = "{createAd.negativeMinVideos}")
    private Long minVideos;

    @Min(value = 0, message = "{createAd.negativeMinSubscribers}")
    private Long minSubscribers;

    @Min(value = 0, message = "{createAd.negativeMinViews}")
    private Long minViews;

    @NotNull(message = "{createAd.nullPicture}")
    private String pictureBase64;

    @Valid
    private List<CharacteristicBindingModel> characteristics;

    private Company company;

    private String remoteUrl;
}
