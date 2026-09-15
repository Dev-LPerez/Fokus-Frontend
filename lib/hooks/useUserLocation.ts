'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface UserLocationState extends UserCoordinates {
  denied: boolean;
  loading: boolean;
  error: string | null;
}

const STORAGE_DISMISS_KEY = 'fokus_location_banner_dismissed';

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocationState>({
    latitude: null,
    longitude: null,
    denied: false,
    loading: true,
    error: null,
  });

  const [showLocationBanner, setShowLocationBanner] = useState<boolean>(false);

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocalización no soportada en este navegador.',
      }));
      setShowLocationBanner(true);
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          denied: false,
          loading: false,
          error: null,
        });
        setShowLocationBanner(false);
      },
      (err) => {
        const isDenied = err.code === err.PERMISSION_DENIED;
        setLocation((prev) => ({
          ...prev,
          denied: isDenied,
          loading: false,
          error: err.message,
        }));

        // Check if user dismissed in the current session
        const wasDismissed =
          typeof window !== 'undefined' &&
          sessionStorage.getItem(STORAGE_DISMISS_KEY) === 'true';

        if (isDenied && !wasDismissed) {
          setShowLocationBanner(true);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  const dismissBanner = useCallback(() => {
    setShowLocationBanner(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_DISMISS_KEY, 'true');
    }
  }, []);

  const resetDismissal = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_DISMISS_KEY);
    }
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    showLocationBanner,
    setShowLocationBanner,
    dismissBanner,
    requestLocation,
    resetDismissal,
  };
}
