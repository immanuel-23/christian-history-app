package com.christianhistory.app.controller;

import com.christianhistory.app.model.Preacher;
import com.christianhistory.app.repository.PreacherRepository;
import com.christianhistory.app.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preachers")
@CrossOrigin(origins = "*") // For development flexibility
public class PreacherController {

    @Autowired
    private PreacherRepository preacherRepository;

    @Autowired
    private CacheService cacheService;

    @GetMapping
    @Cacheable("preachers")
    public List<Preacher> getAllPreachers() {
        return preacherRepository.findAll();
    }

    @PostMapping
    public Preacher createPreacher(@RequestBody Preacher preacher) {
        Preacher savedPreacher = preacherRepository.save(preacher);
        cacheService.clearAllCaches();
        return savedPreacher;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "preachers", key = "#id")
    public ResponseEntity<Preacher> getPreacherById(@PathVariable Long id) {
        return preacherRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Preacher> updatePreacher(@PathVariable Long id, @RequestBody Preacher preacherDetails) {
        return preacherRepository.findById(id)
                .map(preacher -> {
                    preacher.setName(preacherDetails.getName());
                    preacher.setDateOfBirth(preacherDetails.getDateOfBirth());
                    preacher.setDateOfDeath(preacherDetails.getDateOfDeath());
                    preacher.setBiography(preacherDetails.getBiography());
                    preacher.setTheologyFocus(preacherDetails.getTheologyFocus());
                    preacher.setImageUrl(preacherDetails.getImageUrl());
                    Preacher updatedPreacher = preacherRepository.save(preacher);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok(updatedPreacher);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePreacher(@PathVariable Long id) {
        return preacherRepository.findById(id)
                .map(preacher -> {
                    preacherRepository.delete(preacher);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
