package com.christianhistory.app.controller;

import com.christianhistory.app.model.Missionary;
import com.christianhistory.app.repository.MissionaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missionaries")
@CrossOrigin(origins = "*")
public class MissionaryController {

    @Autowired
    private MissionaryRepository missionaryRepository;

    @GetMapping
    public List<Missionary> getAllMissionaries() {
        return missionaryRepository.findAll();
    }

    @PostMapping
    public Missionary createMissionary(@RequestBody Missionary missionary) {
        return missionaryRepository.save(missionary);
    }

    @GetMapping("/{id}")
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
                    return ResponseEntity.ok(missionaryRepository.save(missionary));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMissionary(@PathVariable Long id) {
        return missionaryRepository.findById(id)
                .map(missionary -> {
                    missionaryRepository.delete(missionary);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
