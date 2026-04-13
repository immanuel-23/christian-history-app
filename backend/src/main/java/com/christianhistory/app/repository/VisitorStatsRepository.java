package com.christianhistory.app.repository;

import com.christianhistory.app.model.VisitorStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorStatsRepository extends JpaRepository<VisitorStats, Long> {
}
