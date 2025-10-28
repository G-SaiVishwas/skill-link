import { GEO_CONSTANTS } from '../config/constants';

class GeoService {
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const R = GEO_CONSTANTS.EARTH_RADIUS_KM;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  /**
   * Check if a point is within radius of another point
   */
  isWithinRadius(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
    return distance <= radiusKm;
  }

  /**
   * Get approximate coordinates for Indian cities (fallback data)
   */
  getCityCoordinates(city: string): { lat: number; lng: number } | null {
    const cities: Record<string, { lat: number; lng: number }> = {
      hyderabad: { lat: 17.385, lng: 78.4867 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      mumbai: { lat: 19.076, lng: 72.8777 },
      delhi: { lat: 28.7041, lng: 77.1025 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      pune: { lat: 18.5204, lng: 73.8567 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 },
      kanpur: { lat: 26.4499, lng: 80.3319 },
      nagpur: { lat: 21.1458, lng: 79.0882 },
      indore: { lat: 22.7196, lng: 75.8577 },
      bhopal: { lat: 23.2599, lng: 77.4126 },
    };

    const normalized = city.toLowerCase().trim();
    return cities[normalized] || null;
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }
}

export const geoService = new GeoService();
