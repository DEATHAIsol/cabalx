interface SolanaTrackerConfig {
  baseUrl: string;
  apiKey: string;
  pnlWindow: string;
  hideDetails: string;
  authHeader: string;
  requestTimeout: number;
  cacheTtl: number;
}

interface SolanaTrackerSummary {
  realized: number;
  unrealized: number;
  total: number;
  totalInvested: number;
  totalWins: number;
  totalLosses: number;
  averageBuyAmount: number;
  winPercentage: number;
  lossPercentage: number;
  neutralPercentage: number;
}

interface SolanaTrackerResponse {
  summary: SolanaTrackerSummary;
  [key: string]: any;
}

interface MetricsResponse {
  wallet: string;
  winRate: number;
  totalPnl: number;
  totalTrades: number;
  cabalPoints: number;
  sourceWindow: string;
  updatedAt: string;
}

interface CacheEntry {
  data: SolanaTrackerResponse;
  timestamp: number;
}

class SolanaTrackerService {
  private config: SolanaTrackerConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private metrics = {
    totalFetches: 0,
    cacheHits: 0,
    externalCallLatency: 0,
  };

  constructor() {
    this.config = {
      baseUrl: process.env.SOLANA_TRACKER_BASE_URL || 'https://data.solanatracker.io',
      apiKey: process.env.SOLANA_TRACKER_API_KEY || '8dc2e51b-93c0-4732-9fe8-d77d14282a34',
      pnlWindow: process.env.SOLANA_TRACKER_PNL_WINDOW || '30d',
      hideDetails: process.env.SOLANA_TRACKER_HIDE_DETAILS || 'yes',
      authHeader: process.env.SOLANA_TRACKER_AUTH_HEADER || 'x-api-key',
      requestTimeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '10000'),
      cacheTtl: parseInt(process.env.METRICS_CACHE_TTL_MS || '300000'),
    };
  }

  private getCacheKey(wallet: string, window?: string, hideDetails?: string): string {
    return `${wallet}|${window || this.config.pnlWindow}|${hideDetails || this.config.hideDetails}`;
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.config.cacheTtl;
  }

  private async makeRequest(url: string, retries = 1): Promise<SolanaTrackerResponse> {
    const startTime = Date.now();
    
    try {
      const headers: Record<string, string> = {};
      
      // Set authentication header
      if (this.config.authHeader === 'x-api-key') {
        headers['x-api-key'] = this.config.apiKey;
      } else {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        // Return empty data for 404
        return {
          summary: {
            realized: 0,
            unrealized: 0,
            total: 0,
            totalInvested: 0,
            totalWins: 0,
            totalLosses: 0,
            averageBuyAmount: 0,
            winPercentage: 0,
            lossPercentage: 0,
            neutralPercentage: 0,
          },
        };
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        throw new Error(`Rate limit exceeded. Retry after: ${retryAfter || '60'} seconds`);
      }

      if (response.status >= 500 && retries > 0) {
        // Retry with jittered backoff
        const backoffDelay = Math.random() * 1000 + 1000; // 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.makeRequest(url, retries - 1);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.metrics.externalCallLatency += Date.now() - startTime;
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async fetchWalletData(
    wallet: string, 
    window?: string, 
    hideDetails?: string
  ): Promise<SolanaTrackerResponse> {
    const cacheKey = this.getCacheKey(wallet, window, hideDetails);
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry && this.isCacheValid(cachedEntry)) {
      this.metrics.cacheHits++;
      return cachedEntry.data;
    }

    this.metrics.totalFetches++;
    
    const url = `${this.config.baseUrl}/pnl/${wallet}?showHistoricPnL=${window || this.config.pnlWindow}&hideDetails=${hideDetails || this.config.hideDetails}`;
    
    const data = await this.makeRequest(url);
    
    // Cache the response
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  calculateMetrics(wallet: string, data: SolanaTrackerResponse, window: string): MetricsResponse {
    const { summary } = data;

    // Calculate derived metrics
    const winRate = Math.round((summary.winPercentage || 0) * 100) / 100; // Round to 2 decimal places
    const totalPnl = summary.realized || 0;
    const totalTrades = (summary.totalWins || 0) + (summary.totalLosses || 0);

    // Calculate cabal points
    let cabalPoints = 0;
    
    if (totalTrades > 0 && summary.averageBuyAmount > 0) {
      const totalInvested = summary.totalInvested || 0;
      const avgBuy = summary.averageBuyAmount;
      const winRateFraction = (summary.winPercentage || 0) / 100;
      
      const base = (totalInvested / totalTrades) / avgBuy;
      cabalPoints = base * winRateFraction * 1000;
      
      // Clamp to reasonable max and round to 2 decimals
      cabalPoints = Math.min(cabalPoints, 1e7);
      cabalPoints = Math.round(cabalPoints * 100) / 100;
    }

    return {
      wallet,
      winRate,
      totalPnl,
      totalTrades,
      cabalPoints,
      sourceWindow: window,
      updatedAt: new Date().toISOString(),
    };
  }

  getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  validateWallet(wallet: string): boolean {
    // Basic Solana address validation (base58, 32-44 characters)
    // Base58 characters: 1-9, A-H, J-N, P-Z, a-k, m-z (excluding 0, I, O, l)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(wallet);
  }
}

export const solanaTrackerService = new SolanaTrackerService();
export type { MetricsResponse, SolanaTrackerResponse }; 