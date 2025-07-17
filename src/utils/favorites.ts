/**
 * Favorite locations management system
 */

import { secureStorage } from './storage';
import { SearchResult } from '@/types/weather';

/**
 * Favorite location interface
 */
export interface FavoriteLocation extends SearchResult {
  id: string;
  addedAt: number;
  lastViewed?: number;
  nickname?: string;
  color?: string;
  notifications?: boolean;
}

/**
 * Favorites manager class
 */
export class FavoritesManager {
  private static readonly STORAGE_KEY = 'favorite-locations';
  private static readonly MAX_FAVORITES = 10;
  private favorites: Map<string, FavoriteLocation> = new Map();
  private subscribers: Set<(favorites: FavoriteLocation[]) => void> = new Set();

  constructor() {
    this.loadFavorites();
  }

  /**
   * Load favorites from storage
   */
  private loadFavorites(): void {
    try {
      const stored = secureStorage.getSecure<FavoriteLocation[]>(FavoritesManager.STORAGE_KEY, []);
      if (stored) {
        this.favorites = new Map(stored.map(fav => [fav.id, fav]));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this.favorites = new Map();
    }
  }

  /**
   * Save favorites to storage
   */
  private saveFavorites(): void {
    try {
      const favoritesArray = Array.from(this.favorites.values());
      secureStorage.setSecure(FavoritesManager.STORAGE_KEY, favoritesArray);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  /**
   * Generate unique ID for favorite
   */
  private generateId(location: SearchResult): string {
    return `fav_${location.lat}_${location.lon}_${Date.now()}`;
  }

  /**
   * Add location to favorites
   */
  addFavorite(location: SearchResult, nickname?: string, color?: string): FavoriteLocation | null {
    // Check if already exists
    if (this.isFavorite(location.lat, location.lon)) {
      return null;
    }

    // Check limit
    if (this.favorites.size >= FavoritesManager.MAX_FAVORITES) {
      throw new Error(`Maximum ${FavoritesManager.MAX_FAVORITES} favorites allowed`);
    }

    const favorite: FavoriteLocation = {
      ...location,
      id: this.generateId(location),
      addedAt: Date.now(),
      nickname,
      color: color || this.getRandomColor(),
      notifications: true,
    };

    this.favorites.set(favorite.id, favorite);
    this.saveFavorites();
    this.notifySubscribers();

    return favorite;
  }

  /**
   * Remove favorite by ID
   */
  removeFavorite(favoriteId: string): boolean {
    const removed = this.favorites.delete(favoriteId);
    if (removed) {
      this.saveFavorites();
      this.notifySubscribers();
    }
    return removed;
  }

  /**
   * Remove favorite by coordinates
   */
  removeFavoriteByCoords(lat: number, lon: number): boolean {
    const favorite = this.findByCoords(lat, lon);
    if (favorite) {
      return this.removeFavorite(favorite.id);
    }
    return false;
  }

  /**
   * Update favorite
   */
  updateFavorite(favoriteId: string, updates: Partial<FavoriteLocation>): boolean {
    const favorite = this.favorites.get(favoriteId);
    if (!favorite) return false;

    const updated = { ...favorite, ...updates };
    this.favorites.set(favoriteId, updated);
    this.saveFavorites();
    this.notifySubscribers();

    return true;
  }

  /**
   * Check if location is favorited
   */
  isFavorite(lat: number, lon: number): boolean {
    return this.findByCoords(lat, lon) !== null;
  }

  /**
   * Find favorite by coordinates
   */
  findByCoords(lat: number, lon: number): FavoriteLocation | null {
    for (const favorite of this.favorites.values()) {
      // Use small tolerance for coordinate comparison
      if (Math.abs(favorite.lat - lat) < 0.001 && Math.abs(favorite.lon - lon) < 0.001) {
        return favorite;
      }
    }
    return null;
  }

  /**
   * Get all favorites
   */
  getFavorites(): FavoriteLocation[] {
    return Array.from(this.favorites.values()).sort((a, b) => {
      // Sort by last viewed (most recent first), then by added date
      if (a.lastViewed && b.lastViewed) {
        return b.lastViewed - a.lastViewed;
      }
      if (a.lastViewed && !b.lastViewed) return -1;
      if (!a.lastViewed && b.lastViewed) return 1;
      return b.addedAt - a.addedAt;
    });
  }

  /**
   * Get favorite by ID
   */
  getFavorite(favoriteId: string): FavoriteLocation | null {
    return this.favorites.get(favoriteId) || null;
  }

  /**
   * Mark favorite as viewed
   */
  markAsViewed(favoriteId: string): void {
    const favorite = this.favorites.get(favoriteId);
    if (favorite) {
      favorite.lastViewed = Date.now();
      this.favorites.set(favoriteId, favorite);
      this.saveFavorites();
      this.notifySubscribers();
    }
  }

  /**
   * Mark favorite as viewed by coordinates
   */
  markAsViewedByCoords(lat: number, lon: number): void {
    const favorite = this.findByCoords(lat, lon);
    if (favorite) {
      this.markAsViewed(favorite.id);
    }
  }

  /**
   * Get favorites count
   */
  getCount(): number {
    return this.favorites.size;
  }

  /**
   * Get remaining slots
   */
  getRemainingSlots(): number {
    return FavoritesManager.MAX_FAVORITES - this.favorites.size;
  }

  /**
   * Clear all favorites
   */
  clearAll(): void {
    this.favorites.clear();
    this.saveFavorites();
    this.notifySubscribers();
  }

  /**
   * Export favorites
   */
  exportFavorites(): string {
    const data = {
      version: '1.0',
      exportedAt: Date.now(),
      favorites: Array.from(this.favorites.values()),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import favorites
   */
  importFavorites(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    const result = { success: false, imported: 0, errors: [] as string[] };

    try {
      const data = JSON.parse(jsonData);
      
      if (!data.favorites || !Array.isArray(data.favorites)) {
        result.errors.push('Invalid format: favorites array not found');
        return result;
      }

      let imported = 0;
      for (const fav of data.favorites) {
        try {
          if (this.favorites.size >= FavoritesManager.MAX_FAVORITES) {
            result.errors.push('Maximum favorites limit reached');
            break;
          }

          if (!this.isFavorite(fav.lat, fav.lon)) {
            const favorite: FavoriteLocation = {
              ...fav,
              id: this.generateId(fav),
              addedAt: Date.now(),
            };
            this.favorites.set(favorite.id, favorite);
            imported++;
          }
        } catch (error) {
          result.errors.push(`Failed to import ${fav.name}: ${error}`);
        }
      }

      if (imported > 0) {
        this.saveFavorites();
        this.notifySubscribers();
        result.success = true;
        result.imported = imported;
      }

    } catch (error) {
      result.errors.push(`Invalid JSON format: ${error}`);
    }

    return result;
  }

  /**
   * Subscribe to favorites updates
   */
  subscribe(callback: (favorites: FavoriteLocation[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(): void {
    const favorites = this.getFavorites();
    this.subscribers.forEach(callback => callback(favorites));
  }

  /**
   * Get random color for favorite
   */
  private getRandomColor(): string {
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // yellow
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
      '#ec4899', // pink
      '#6b7280', // gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

/**
 * Favorites utilities
 */
export const favoritesUtils = {
  /**
   * Validate favorite location data
   */
  validateLocation: (location: any): boolean => {
    return (
      location &&
      typeof location.name === 'string' &&
      typeof location.lat === 'number' &&
      typeof location.lon === 'number' &&
      location.lat >= -90 && location.lat <= 90 &&
      location.lon >= -180 && location.lon <= 180
    );
  },

  /**
   * Format location display name
   */
  formatDisplayName: (favorite: FavoriteLocation): string => {
    if (favorite.nickname) {
      return favorite.nickname;
    }
    
    if (favorite.state) {
      return `${favorite.name}, ${favorite.state}`;
    }
    
    return `${favorite.name}, ${favorite.country}`;
  },

  /**
   * Get location distance (rough calculation)
   */
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },
};

/**
 * Global favorites manager instance
 */
export const favoritesManager = new FavoritesManager();
