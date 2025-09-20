export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AddressDetails {
  formatted_address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  country: string;
}

export class LocationService {
  // Get user's current location using browser geolocation
  static async getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Unknown error occurred';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Convert coordinates to address using Nominatim (free OpenStreetMap service)
  static async getAddressFromCoordinates(latitude: number, longitude: number): Promise<AddressDetails> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SathiSevaConnect/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address details');
      }

      const data = await response.json();
      
      return {
        formatted_address: data.display_name || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        pincode: data.address?.postcode || '',
        locality: data.address?.neighbourhood || data.address?.suburb || data.address?.hamlet || '',
        country: data.address?.country || ''
      };
    } catch (error) {
      console.error('Error fetching address:', error);
      throw new Error('Failed to get address details');
    }
  }

  // Calculate distance between two coordinates (in kilometers)
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Check if two locations are in the same locality (within 5km)
  static areInSameLocality(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number,
    maxDistance: number = 5
  ): boolean {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= maxDistance;
  }

  // Get coordinates from address using Nominatim geocoding
  static async getCoordinatesFromAddress(address: string): Promise<LocationCoordinates> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'SathiSevaConnect/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error('Failed to get coordinates from address');
    }
  }
}
