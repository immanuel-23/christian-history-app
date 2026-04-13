package com.christianhistory.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String healthCheck() {
        return "Christian History Archive API is Running & Healthy! ✝️✨";
    }
}
