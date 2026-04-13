package com.christianhistory.app.controller;

import com.christianhistory.app.model.BibleVerse;
import com.christianhistory.app.repository.BibleVerseRepository;
import com.christianhistory.app.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bible-verses")
@CrossOrigin(origins = "*")
public class BibleVerseController {

    @Autowired
    private BibleVerseRepository bibleVerseRepository;

    @Autowired
    private CacheService cacheService;

    @GetMapping
    @Cacheable("bible-verses")
    public List<BibleVerse> getAllVerses() {
        return bibleVerseRepository.findAll();
    }

    // Get verses filtered by category (e.g. /api/bible-verses/category/churches)
    @GetMapping("/category/{category}")
    @Cacheable(value = "bible-verses-category", key = "#category")
    public List<BibleVerse> getVersesByCategory(@PathVariable String category) {
        return bibleVerseRepository.findByCategory(category);
    }

    @PostMapping
    public BibleVerse createVerse(@RequestBody BibleVerse verse) {
        BibleVerse savedVerse = bibleVerseRepository.save(verse);
        cacheService.clearAllCaches();
        return savedVerse;
    }

    @PutMapping("/{id}")
    public ResponseEntity<BibleVerse> updateVerse(@PathVariable Long id, @RequestBody BibleVerse verseDetails) {
        return bibleVerseRepository.findById(id)
                .map(verse -> {
                    verse.setVerseText(verseDetails.getVerseText());
                    verse.setReference(verseDetails.getReference());
                    verse.setCategory(verseDetails.getCategory());
                    BibleVerse updatedVerse = bibleVerseRepository.save(verse);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok(updatedVerse);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVerse(@PathVariable Long id) {
        return bibleVerseRepository.findById(id)
                .map(verse -> {
                    bibleVerseRepository.delete(verse);
                    cacheService.clearAllCaches();
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
