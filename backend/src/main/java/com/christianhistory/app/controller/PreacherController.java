package com.christianhistory.app.controller;

import com.christianhistory.app.model.Preacher;
import com.christianhistory.app.repository.PreacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preachers")
@CrossOrigin(origins = "*") // For development flexibility
public class PreacherController {

    @Autowired
    private PreacherRepository preacherRepository;

    @GetMapping
    public List<Preacher> getAllPreachers() {
        return preacherRepository.findAll();
    }

    @PostMapping
    public Preacher createPreacher(@RequestBody Preacher preacher) {
        return preacherRepository.save(preacher);
    }

    @GetMapping("/{id}")
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
                    return ResponseEntity.ok(preacherRepository.save(preacher));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePreacher(@PathVariable Long id) {
        return preacherRepository.findById(id)
                .map(preacher -> {
                    preacherRepository.delete(preacher);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
