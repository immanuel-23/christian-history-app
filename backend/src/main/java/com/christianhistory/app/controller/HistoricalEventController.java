package com.christianhistory.app.controller;

import com.christianhistory.app.model.HistoricalEvent;
import com.christianhistory.app.repository.HistoricalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // For development flexibility
public class HistoricalEventController {

    @Autowired
    private HistoricalEventRepository eventRepository;

    @GetMapping
    public List<HistoricalEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public HistoricalEvent createEvent(@RequestBody HistoricalEvent event) {
        return eventRepository.save(event);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricalEvent> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricalEvent> updateEvent(@PathVariable Long id, @RequestBody HistoricalEvent eventDetails) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setEventName(eventDetails.getEventName());
                    event.setEventDate(eventDetails.getEventDate());
                    event.setLocation(eventDetails.getLocation());
                    event.setDescription(eventDetails.getDescription());
                    event.setSignificance(eventDetails.getSignificance());
                    event.setImageUrl(eventDetails.getImageUrl());
                    return ResponseEntity.ok(eventRepository.save(event));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
