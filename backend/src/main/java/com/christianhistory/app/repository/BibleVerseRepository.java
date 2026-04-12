package com.christianhistory.app.repository;

import com.christianhistory.app.model.BibleVerse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BibleVerseRepository extends JpaRepository<BibleVerse, Long> {
}
