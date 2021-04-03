package com.tugab.adspartners.domain.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cloudinary_resource")
public class CloudinaryResource {

    @Id
    private String id;

    @Column(name = "size")
    private Long size;

    @Column(name = "format")
    private String format;

    @Column(name = "resource_type")
    private String resourceType;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "url")
    private String url;
}
