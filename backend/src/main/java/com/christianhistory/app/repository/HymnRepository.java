package com.christianhistory.app.repository;

import com.christianhistory.app.model.Hymn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HymnRepository extends JpaRepository<Hymn, Long> {
}
