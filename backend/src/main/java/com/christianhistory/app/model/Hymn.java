package com.christianhistory.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "hymns")
public class Hymn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String author;

    private Integer yearWritten;

    @Column(columnDefinition = "TEXT")
    private String lyrics;

    @Column(columnDefinition = "TEXT")
    private String audioUrl;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
}
