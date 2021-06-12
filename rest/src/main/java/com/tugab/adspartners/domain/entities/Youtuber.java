package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.Authority;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import javax.persistence.*;
import java.util.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "youtuber")
public class Youtuber extends UserInfo implements OAuth2User {

    @Column(name = "subscriber_count", nullable = false)
    private Long subscriberCount;

    @Column(name = "video_count", nullable = false)
    private Long videoCount;

    @Column(name = "view_count", nullable = false)
    private Long viewCount;

    @Column(name = "update_date", nullable = false)
    private Date updateDate;

    @Column(name = "profile_picture", nullable = false)
    private String profilePicture;

    private String description;

    @Column(name = "published_at", nullable = false)
    private Date publishedAt;

    @Column(name = "channel_id", nullable = false)
    private String channelId;

    @OneToMany(mappedBy = "id.youtuber", targetEntity = AdApplication.class)
    private List<AdApplication> adApplicationList;

    @Transient
    private Map<String, Object> attributes;

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(Authority.YOUTUBER.name()));
    }
}
