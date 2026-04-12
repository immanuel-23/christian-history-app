package com.christianhistory.app.config;

import com.christianhistory.app.model.AdminUser;
import com.christianhistory.app.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (adminUserRepository.count() == 0) {
            AdminUser admin = AdminUser.builder()
                    .username("immanuel__.23")
                    .password(passwordEncoder.encode("Trycatch@1234"))
                    .build();
            adminUserRepository.save(admin);
            System.out.println("------------------------------------------------");
            System.out.println("ADMIN INITIALIZER: Default admin user created!");
            System.out.println("Username: immanuel__.23");
            System.out.println("Password: (stored securely as BCrypt hash)");
            System.out.println("------------------------------------------------");
        }
    }
}
