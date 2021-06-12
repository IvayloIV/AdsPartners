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
public class EditAdBindingModel {

    private Long id;

    @Length(min = 3, max = 256, message = "{editAd.titleLength}")
    private String title;

    @Length(max = 1024, message = "{editAd.descriptionLength}")
    private String description;

    @NotNull(message = "{editAd.nullReward}")
    @DecimalMin(value = "0.01", message = "{editAd.negativeReward}")
    private Double reward;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "{editAd.nullValidTo}")
    @Future(message = "{editAd.validToFuture}")
    private Date validTo;

    @Min(value = 0, message = "{editAd.negativeMinVideos}")
    private Long minVideos;

    @Min(value = 0, message = "{editAd.negativeMinSubscribers}")
    private Long minSubscribers;

    @Min(value = 0, message = "{editAd.negativeMinViews}")
    private Long minViews;

    private String pictureBase64;

    @Valid
    private List<CharacteristicBindingModel> characteristics;

    private Company company;
}
