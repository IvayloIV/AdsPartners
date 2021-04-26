CREATE TABLE IF NOT EXISTS `user`
(
    `id`           BIGINT UNSIGNED AUTO_INCREMENT,
    `email`        VARCHAR(255) NOT NULL,
    `name`         VARCHAR(255) NOT NULL,
    `created_date` DATETIME     NOT NULL,
    `password`     VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`email`)
);

CREATE TABLE IF NOT EXISTS `role`
(
    `id`        BIGINT UNSIGNED AUTO_INCREMENT,
    `authority` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `user_role`
(
    `user_id` BIGINT UNSIGNED NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE IF NOT EXISTS `youtuber`
(
    `id`               BIGINT UNSIGNED AUTO_INCREMENT,
    `email`            VARCHAR(255)    NOT NULL,
    `name`             VARCHAR(255)    NOT NULL,
    `channel_id`       VARCHAR(255),
    `description`      VARCHAR(255),
    `profile_picture`  VARCHAR(511)    NOT NULL,
    `published_at`     DATETIME        NOT NULL,
    `subscriber_count` BIGINT UNSIGNED NOT NULL,
    `video_count`      BIGINT UNSIGNED NOT NULL,
    `view_count`       BIGINT UNSIGNED NOT NULL,
    `update_date`      DATETIME        NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`email`)
);

CREATE TABLE IF NOT EXISTS `cloudinary_resource`
(
    `id`            VARCHAR(255),
    `created_at`    DATETIME        NOT NULL,
    `format`        VARCHAR(255),
    `resource_type` VARCHAR(255)    NOT NULL,
    `size`          BIGINT UNSIGNED NOT NULL,
    `url`           VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `company`
(
    `id`                    BIGINT UNSIGNED AUTO_INCREMENT,
    `workers_count`         INT UNSIGNED,
    `logo`                  VARCHAR(255)    NOT NULL,
    `company_creation_date` DATETIME        NOT NULL,
    `description`           VARCHAR(1023)   NOT NULL,
    `income_last_year`      DECIMAL(9, 2),
    `phone`                 VARCHAR(63)     NOT NULL,
    `status`                VARCHAR(255)    NOT NULL,
    `status_modify_date`    DATETIME,
    `town`                  VARCHAR(255)    NOT NULL,
    `user_id`               BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`logo`) REFERENCES `cloudinary_resource` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE IF NOT EXISTS `ad`
(
    `id`                BIGINT UNSIGNED AUTO_INCREMENT,
    `creation_date`     DATE            NOT NULL,
    `is_blocked`        BIT(1)          NOT NULL,
    `min_subscribers`   BIGINT UNSIGNED,
    `min_videos`        BIGINT UNSIGNED,
    `min_views`         BIGINT UNSIGNED,
    `reward`            DECIMAL(9, 2)   NOT NULL,
    `short_description` VARCHAR(1023),
    `title`             VARCHAR(255)    NOT NULL,
    `valid_to`          DATETIME        NOT NULL,
    `creator_id`        BIGINT UNSIGNED NOT NULL,
    `picture_id`        VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`creator_id`) REFERENCES `company` (`id`),
    FOREIGN KEY (`picture_id`) REFERENCES `cloudinary_resource` (`id`)
);

CREATE TABLE IF NOT EXISTS `characteristic`
(
    `id`    BIGINT UNSIGNED AUTO_INCREMENT,
    `name`  VARCHAR(255)    NOT NULL,
    `value` VARCHAR(255)    NOT NULL,
    `ad_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`ad_id`) REFERENCES `ad` (`id`)
);

CREATE TABLE IF NOT EXISTS `ad_application`
(
    `youtuber_id`      BIGINT UNSIGNED NOT NULL,
    `ad_id`            BIGINT UNSIGNED NOT NULL,
    `application_date` DATETIME        NOT NULL,
    `description`      VARCHAR(1023),
    `mail_sent`        BIT(1)          NOT NULL,
    `type`             VARCHAR(255)    NOT NULL,
    PRIMARY KEY (`ad_id`, `youtuber_id`),
    FOREIGN KEY (`ad_id`) REFERENCES `ad` (`id`),
    FOREIGN KEY (`youtuber_id`) REFERENCES `youtuber` (`id`)
);

CREATE TABLE IF NOT EXISTS `ad_rating`
(
    `youtuber_id`   BIGINT UNSIGNED  NOT NULL,
    `ad_id`         BIGINT UNSIGNED  NOT NULL,
    `creation_date` DATETIME         NOT NULL,
    `rating`        TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (`ad_id`, `youtuber_id`),
    FOREIGN KEY (`youtuber_id`) REFERENCES `youtuber` (`id`),
    FOREIGN KEY (`ad_id`) REFERENCES `ad` (`id`)
);

CREATE TABLE IF NOT EXISTS `youtuber_rating`
(
    `youtuber_id`   BIGINT UNSIGNED  NOT NULL,
    `company_id`    BIGINT UNSIGNED  NOT NULL,
    `creation_date` DATETIME         NOT NULL,
    `rating`        TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (`company_id`, `youtuber_id`),
    FOREIGN KEY (`youtuber_id`) REFERENCES `youtuber` (`id`),
    FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
);


CREATE TABLE IF NOT EXISTS `subscription`
(
    `youtuber_id`       BIGINT UNSIGNED NOT NULL,
    `company_id`        BIGINT UNSIGNED NOT NULL,
    `is_blocked`        BIT(1)          NOT NULL,
    `subscription_date` DATETIME        NOT NULL,
    PRIMARY KEY (`company_id`, `youtuber_id`),
    FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
    FOREIGN KEY (`youtuber_id`) REFERENCES `youtuber` (`id`)
);