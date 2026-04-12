package com.christianhistory.app.controller;

import com.christianhistory.app.model.BibleVerse;
import com.christianhistory.app.repository.BibleVerseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bible-verses")
@CrossOrigin(origins = "*")
public class BibleVerseController {

    @Autowired
    private BibleVerseRepository bibleVerseRepository;

    @GetMapping
    public List<BibleVerse> getAllVerses() {
        return bibleVerseRepository.findAll();
    }

    @PostMapping
    public BibleVerse createVerse(@RequestBody BibleVerse verse) {
        return bibleVerseRepository.save(verse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BibleVerse> updateVerse(@PathVariable Long id, @RequestBody BibleVerse verseDetails) {
        return bibleVerseRepository.findById(id)
                .map(verse -> {
                    verse.setVerseText(verseDetails.getVerseText());
                    verse.setReference(verseDetails.getReference());
                    return ResponseEntity.ok(bibleVerseRepository.save(verse));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVerse(@PathVariable Long id) {
        return bibleVerseRepository.findById(id)
                .map(verse -> {
                    bibleVerseRepository.delete(verse);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
