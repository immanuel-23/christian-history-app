package com.christianhistory.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "visitor_stats")
public class VisitorStats {

    @Id
    private Long id = 1L; // Always use ID 1 for single row stats

    private Long visitCount = 0L;

    public VisitorStats() {}

    public VisitorStats(Long id, Long visitCount) {
        this.id = id;
        this.visitCount = visitCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(Long visitCount) {
        this.visitCount = visitCount;
    }
}
