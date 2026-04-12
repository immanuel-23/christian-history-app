package com.christianhistory.app.repository;

import com.christianhistory.app.model.Missionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissionaryRepository extends JpaRepository<Missionary, Long> {
}
