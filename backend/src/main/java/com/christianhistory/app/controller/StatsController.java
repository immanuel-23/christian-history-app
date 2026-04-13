package com.christianhistory.app.controller;

import com.christianhistory.app.model.VisitorStats;
import com.christianhistory.app.repository.VisitorStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private VisitorStatsRepository statsRepository;

    @GetMapping
    public Long getVisitorCount() {
        return statsRepository.findById(1L)
                .map(VisitorStats::getVisitCount)
                .orElse(0L);
    }

    @PostMapping("/increment")
    public void incrementCount() {
        VisitorStats stats = statsRepository.findById(1L)
                .orElse(new VisitorStats(1L, 0L));
        stats.setVisitCount(stats.getVisitCount() + 1);
        statsRepository.save(stats);
    }
}
