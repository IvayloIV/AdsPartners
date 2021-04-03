package com.tugab.adspartners.utils;

import com.tugab.adspartners.domain.entities.Role;
import com.tugab.adspartners.domain.entities.User;
import com.tugab.adspartners.domain.enums.Authority;
import com.tugab.adspartners.repository.RoleRepository;
import com.tugab.adspartners.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${default.admin.name}")
    private String adminName;

    @Value("${default.admin.email}")
    private String adminEmail;

    @Value("${default.admin.password}")
    private String adminPassword;

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        saveRolesToDb();
        saveAdminToDb();
    }

    private void saveAdminToDb() {
        if (this.userRepository.count() == 0) {
            User user = new User();
            user.setEmail(this.adminEmail);
            user.setName(this.adminName);
            user.setPassword(this.passwordEncoder.encode(this.adminPassword));
            user.setCreatedDate(new Date());

            Role adminRole = this.roleRepository.findByAuthority(Authority.ADMIN)
                    .orElseThrow(() -> new IllegalArgumentException("Admin role not found."));
            user.addRole(adminRole);

            this.userRepository.save(user);
        }
    }

    private void saveRolesToDb() {
        if (roleRepository.count() == 0) {
            Arrays.stream(Authority.values())
                    .filter(r -> !r.name().equals(Authority.YOUTUBER.name()))
                    .forEach(this::saveRole);
        }
    }

    private void saveRole(Authority authority) {
        Role role = new Role();
        role.setAuthority(authority);
        this.roleRepository.save(role);
    }
}
