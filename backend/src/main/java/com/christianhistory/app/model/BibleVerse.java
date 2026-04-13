package com.christianhistory.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bible_verses")
public class BibleVerse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String verseText;

    private String reference;

    // Category maps to a tab: churches, preachers, missionaries, hymns, events, or general
    @Column(nullable = false)
    private String category = "general";
}
