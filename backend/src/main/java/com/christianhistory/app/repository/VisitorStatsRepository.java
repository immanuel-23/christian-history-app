package com.christianhistory.app.repository;

import com.christianhistory.app.model.VisitorStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface VisitorStatsRepository extends JpaRepository<VisitorStats, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE VisitorStats v SET v.visitCount = v.visitCount + 1 WHERE v.id = :id")
    void incrementVisitCount(Long id);
}
