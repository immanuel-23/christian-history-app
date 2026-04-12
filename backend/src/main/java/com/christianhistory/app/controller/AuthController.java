package com.christianhistory.app.controller;

import com.christianhistory.app.dto.JwtResponse;
import com.christianhistory.app.dto.LoginRequest;
import com.christianhistory.app.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.christianhistory.app.dto.JwtResponse;
import com.christianhistory.app.dto.LoginRequest;
import com.christianhistory.app.model.AdminUser;
import com.christianhistory.app.repository.AdminUserRepository;
import com.christianhistory.app.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        Optional<AdminUser> adminOpt = adminUserRepository.findByUsername(loginRequest.getUsername());

        if (adminOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), adminOpt.get().getPassword())) {
            String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getUsername()));
        }

        return ResponseEntity.status(401).body("Error: Unauthorized. Invalid credentials!");
    }
}
