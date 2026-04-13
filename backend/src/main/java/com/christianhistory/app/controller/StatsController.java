package com.christianhistory.app.controller;

import com.christianhistory.app.model.VisitorStats;
import com.christianhistory.app.repository.VisitorStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.christianhistory.app.service.StatsService;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private VisitorStatsRepository statsRepository;

    @Autowired
    private StatsService statsService;

    @GetMapping
    public Long getVisitorCount() {
        return statsRepository.findById(1L)
                .map(VisitorStats::getVisitCount)
                .orElse(0L);
    }

    @PostMapping("/increment")
    public void incrementCount() {
        statsService.incrementVisitCount();
    }
}
