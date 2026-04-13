package com.christianhistory.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    @Autowired
    private CacheManager cacheManager;

    /**
     * Clears all in-memory caches.
     * Called whenever an admin updates any data to ensure consistency.
     */
    public void clearAllCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        });
        System.out.println("CACHE: All categories cleared successfully.");
    }
}
