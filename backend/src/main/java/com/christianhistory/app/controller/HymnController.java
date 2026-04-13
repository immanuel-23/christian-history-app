package com.christianhistory.app.controller;

import com.christianhistory.app.model.Hymn;
import com.christianhistory.app.repository.HymnRepository;
import com.christianhistory.app.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hymns")
@CrossOrigin(origins = "*")
public class HymnController {

    @Autowired
    private HymnRepository hymnRepository;

    @Autowired
    private CacheService cacheService;

    @GetMapping
    @Cacheable("hymns")
    public List<Hymn> getAllHymns() {
        return hymnRepository.findAll();
    }

    @PostMapping
    public Hymn createHymn(@RequestBody Hymn hymn) {
        Hymn savedHymn = hymnRepository.save(hymn);
        cacheService.clearAllCaches();
        return savedHymn;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "hymns", key = "#id")
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
                    Hymn updatedHymn = hymnRepository.save(hymn);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok(updatedHymn);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHymn(@PathVariable Long id) {
        return hymnRepository.findById(id)
                .map(hymn -> {
                    hymnRepository.delete(hymn);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
