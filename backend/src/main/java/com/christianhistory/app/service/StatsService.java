package com.christianhistory.app.service;

import com.christianhistory.app.repository.VisitorStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private VisitorStatsRepository statsRepository;

    /**
     * Asynchronously increments the visitor count.
     * This is a fire-and-forget operation to prevent blocking the UI.
     */
    @Async
    public void incrementVisitCount() {
        try {
            // Using ID 1L as per the VisitorStats model design
            statsRepository.incrementVisitCount(1L);
        } catch (Exception e) {
            // Log error but don't crash as this is a background task
            System.err.println("Error incrementing visitor stats: " + e.getMessage());
        }
    }
}
