package com.tugab.adspartners.domain.entities;

import com.tugab.adspartners.domain.enums.Authority;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
@Entity
@Table(name = "youtuber")
public class Youtuber extends UserInfo implements OAuth2User {

    @Column(name = "subscriber_count")
    private Long subscriberCount;

    @Column(name = "video_count")
    private Long videoCount;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "update_date")
    private Date updateDate;

    @Column(name = "profile_picture")
    private String profilePicture;

    private String description;

    @Column(name = "published_at")
    private Date publishedAt;

    @Column(name = "channel_id")
    private String channelId;

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
