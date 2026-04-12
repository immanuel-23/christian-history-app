package com.christianhistory.app.controller;

import com.christianhistory.app.model.Hymn;
import com.christianhistory.app.repository.HymnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hymns")
@CrossOrigin(origins = "*")
public class HymnController {

    @Autowired
    private HymnRepository hymnRepository;

    @GetMapping
    public List<Hymn> getAllHymns() {
        return hymnRepository.findAll();
    }

    @PostMapping
    public Hymn createHymn(@RequestBody Hymn hymn) {
        return hymnRepository.save(hymn);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hymn> getHymnById(@PathVariable Long id) {
        return hymnRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hymn> updateHymn(@PathVariable Long id, @RequestBody Hymn hymnDetails) {
        return hymnRepository.findById(id)
                .map(hymn -> {
                    hymn.setTitle(hymnDetails.getTitle());
                    hymn.setAuthor(hymnDetails.getAuthor());
                    hymn.setYearWritten(hymnDetails.getYearWritten());
                    hymn.setLyrics(hymnDetails.getLyrics());
                    hymn.setAudioUrl(hymnDetails.getAudioUrl());
                    hymn.setImageUrl(hymnDetails.getImageUrl());
                    return ResponseEntity.ok(hymnRepository.save(hymn));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHymn(@PathVariable Long id) {
        return hymnRepository.findById(id)
                .map(hymn -> {
                    hymnRepository.delete(hymn);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
