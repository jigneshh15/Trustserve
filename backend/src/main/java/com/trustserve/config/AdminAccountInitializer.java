
package com.trustserve.config;

import com.trustserve.model.User;
import com.trustserve.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminAccountInitializer {

    @Value("${trustserve.admin.email:}")
    private String adminEmail;

    @Value("${trustserve.admin.password:}")
    private String adminPassword;

    @Bean
    public ApplicationRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (adminEmail.isBlank() || adminPassword.isBlank()) {
                System.out.println(
                    "Admin account not created: configure admin environment variables."
                );
                return;
            }

            String email = adminEmail.trim().toLowerCase();

            if (userRepository.existsByEmail(email)) {
                System.out.println("Admin account already exists.");
                return;
            }

            User admin = new User(
                "TrustServe Admin",
                email,
                passwordEncoder.encode(adminPassword),
                "ADMIN"
            );

            userRepository.save(admin);

            System.out.println("TrustServe admin account created.");
        };
    }
}
