import { useState, useCallback } from 'react';
import { RouteData } from '../types';
import { routingService } from '../services/routingService';

interface UseRoutingReturn {
  route: RouteData | null;
  isLoading: boolean;
  error: string | null;
  fetchRoute: (start: [number, number], end: [number, number]) => Promise<void>;
  clearRoute: () => void;
}

export const useRouting = (): UseRoutingReturn => {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(async (start: [number, number], end: [number, number]) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await routingService.getRoute(start, end);
      setRoute(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('useRouting error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    route,
    isLoading,
    error,
    fetchRoute,
    clearRoute
  };
};
