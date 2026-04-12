package com.christianhistory.app.repository;

import com.christianhistory.app.model.HistoricalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricalEventRepository extends JpaRepository<HistoricalEvent, Long> {
}
