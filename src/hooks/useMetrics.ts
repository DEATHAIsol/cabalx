import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface MetricsResponse {
  wallet: string;
  winRate: number;
  totalPnl: number;
  totalTrades: number;
  cabalPoints: number;
  sourceWindow: string;
  updatedAt: string;
}

interface UseMetricsReturn {
  metrics: MetricsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMetrics(): UseMetricsReturn {
  const { publicKey } = useWallet();
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!publicKey) {
      setMetrics(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/metrics/${publicKey.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No data found for this wallet - return zeroed metrics
          setMetrics({
            wallet: publicKey.toString(),
            winRate: 0,
            totalPnl: 0,
            totalTrades: 0,
            cabalPoints: 0,
            sourceWindow: '30d',
            updatedAt: new Date().toISOString()
          });
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      
      // Set default metrics on error
      setMetrics({
        wallet: publicKey.toString(),
        winRate: 0,
        totalPnl: 0,
        totalTrades: 0,
        cabalPoints: 0,
        sourceWindow: '30d',
        updatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [publicKey]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
} 