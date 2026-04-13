package com.christianhistory.app.controller;

import com.christianhistory.app.model.Missionary;
import com.christianhistory.app.repository.MissionaryRepository;
import com.christianhistory.app.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missionaries")
@CrossOrigin(origins = "*")
public class MissionaryController {

    @Autowired
    private MissionaryRepository missionaryRepository;

    @Autowired
    private CacheService cacheService;

    @GetMapping
    @Cacheable("missionaries")
    public List<Missionary> getAllMissionaries() {
        return missionaryRepository.findAll();
    }

    @PostMapping
    public Missionary createMissionary(@RequestBody Missionary missionary) {
        Missionary savedMissionary = missionaryRepository.save(missionary);
        cacheService.clearAllCaches();
        return savedMissionary;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "missionaries", key = "#id")
    public ResponseEntity<Missionary> getMissionaryById(@PathVariable Long id) {
        return missionaryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Missionary> updateMissionary(@PathVariable Long id, @RequestBody Missionary missionaryDetails) {
        return missionaryRepository.findById(id)
                .map(missionary -> {
                    missionary.setName(missionaryDetails.getName());
                    missionary.setWork(missionaryDetails.getWork());
                    missionary.setLifeHistory(missionaryDetails.getLifeHistory());
                    missionary.setServicePeriod(missionaryDetails.getServicePeriod());
                    missionary.setImageUrl(missionaryDetails.getImageUrl());
                    Missionary updatedMissionary = missionaryRepository.save(missionary);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok(updatedMissionary);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMissionary(@PathVariable Long id) {
        return missionaryRepository.findById(id)
                .map(missionary -> {
                    missionaryRepository.delete(missionary);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
