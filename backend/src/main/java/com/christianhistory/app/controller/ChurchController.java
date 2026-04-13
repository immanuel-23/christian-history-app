package com.christianhistory.app.controller;

import com.christianhistory.app.model.Church;
import com.christianhistory.app.repository.ChurchRepository;
import com.christianhistory.app.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/churches")
@CrossOrigin(origins = "*") // For development flexibility
public class ChurchController {

    @Autowired
    private ChurchRepository churchRepository;

    @Autowired
    private CacheService cacheService;

    @GetMapping
    @Cacheable("churches")
    public List<Church> getAllChurches() {
        return churchRepository.findAll();
    }

    @PostMapping
    public Church createChurch(@RequestBody Church church) {
        Church savedChurch = churchRepository.save(church);
        cacheService.clearAllCaches();
        return savedChurch;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "churches", key = "#id")
    public ResponseEntity<Church> getChurchById(@PathVariable Long id) {
        return churchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Church> updateChurch(@PathVariable Long id, @RequestBody Church churchDetails) {
        return churchRepository.findById(id)
                .map(church -> {
                    church.setName(churchDetails.getName());
                    church.setLocation(churchDetails.getLocation());
                    church.setYearEstablished(churchDetails.getYearEstablished());
                    church.setDenomination(churchDetails.getDenomination());
                    church.setDescription(churchDetails.getDescription());
                    church.setImageUrl(churchDetails.getImageUrl());
                    Church updatedChurch = churchRepository.save(church);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok(updatedChurch);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChurch(@PathVariable Long id) {
        return churchRepository.findById(id)
                .map(church -> {
                    churchRepository.delete(church);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
