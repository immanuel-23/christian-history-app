package com.christianhistory.app.repository;

import com.christianhistory.app.model.BibleVerse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BibleVerseRepository extends JpaRepository<BibleVerse, Long> {

    // Find all verses assigned to a specific category (tab section)
    List<BibleVerse> findByCategory(String category);
}
