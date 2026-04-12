package com.christianhistory.app.repository;

import com.christianhistory.app.model.Preacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreacherRepository extends JpaRepository<Preacher, Long> {
}
