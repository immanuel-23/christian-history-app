package com.christianhistory.app.controller;

import com.christianhistory.app.model.Church;
import com.christianhistory.app.repository.ChurchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/churches")
@CrossOrigin(origins = "*") // For development flexibility
public class ChurchController {

    @Autowired
    private ChurchRepository churchRepository;

    @GetMapping
    public List<Church> getAllChurches() {
        return churchRepository.findAll();
    }

    @PostMapping
    public Church createChurch(@RequestBody Church church) {
        return churchRepository.save(church);
    }

    @GetMapping("/{id}")
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
                    return ResponseEntity.ok(churchRepository.save(church));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChurch(@PathVariable Long id) {
        return churchRepository.findById(id)
                .map(church -> {
                    churchRepository.delete(church);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
