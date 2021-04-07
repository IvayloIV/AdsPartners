package com.tugab.adspartners.domain.models.binding.Ad;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tugab.adspartners.domain.entities.Characteristic;
import com.tugab.adspartners.domain.entities.Company;
import com.tugab.adspartners.domain.entities.User;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
public class CreateAdBindingModel {

    @NotNull(message = "Title cannot be empty.")
    @Length(min = 4, message = "Title cannot be less than 3 symbols.")
    private String title;

    private String shortDescription;

    @NotNull(message = "Reward cannot be empty.")
    private Double reward;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "Valid to cannot be empty.")
    private Date validTo;

    private Long minVideos;

    private Long minSubscribers;

    private Long minViews;

    @NotNull(message = "Picture is required.")
    private String pictureBase64;

    private User company;

    private List<Characteristic> characteristics;
}
