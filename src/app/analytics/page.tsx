"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  DollarSign,
  Target,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface TradingData {
  date: string;
  pnl: number;
  trades: number;
  volume: number;
  winRate: number;
}

interface TokenPerformance {
  symbol: string;
  name: string;
  totalTrades: number;
  totalVolume: number;
  avgPnL: number;
  winRate: number;
  lastTrade: Date;
}

// Mock data for analytics
const mockTradingData: TradingData[] = [
  { date: '2024-01-01', pnl: 45.2, trades: 12, volume: 1250, winRate: 75 },
  { date: '2024-01-02', pnl: -12.8, trades: 8, volume: 890, winRate: 62.5 },
  { date: '2024-01-03', pnl: 78.9, trades: 15, volume: 2100, winRate: 80 },
  { date: '2024-01-04', pnl: 23.4, trades: 10, volume: 1560, winRate: 70 },
  { date: '2024-01-05', pnl: -5.6, trades: 6, volume: 720, winRate: 50 },
  { date: '2024-01-06', pnl: 92.1, trades: 18, volume: 2800, winRate: 83.3 },
  { date: '2024-01-07', pnl: 34.7, trades: 11, volume: 1650, winRate: 72.7 },
];

const mockTokenPerformance: TokenPerformance[] = [
  {
    symbol: 'BONK',
    name: 'Bonk',
    totalTrades: 45,
    totalVolume: 12500000,
    avgPnL: 12.5,
    winRate: 78.5,
    lastTrade: new Date(Date.now() - 3600000)
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    totalTrades: 32,
    totalVolume: 8500,
    avgPnL: 8.9,
    winRate: 71.2,
    lastTrade: new Date(Date.now() - 7200000)
  },
  {
    symbol: 'POPCAT',
    name: 'Popcat',
    totalTrades: 28,
    totalVolume: 4200,
    avgPnL: -2.3,
    winRate: 45.8,
    lastTrade: new Date(Date.now() - 10800000)
  },
  {
    symbol: 'BOME',
    name: 'Book of Meme',
    totalTrades: 19,
    totalVolume: 3100,
    avgPnL: 15.7,
    winRate: 84.2,
    lastTrade: new Date(Date.now() - 14400000)
  }
];

export default function AnalyticsPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [tradingData, setTradingData] = useState<TradingData[]>([]);
  const [tokenPerformance, setTokenPerformance] = useState<TokenPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    setTradingData(mockTradingData);
    setTokenPerformance(mockTokenPerformance);
  }, [connected, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const totalPnL = tradingData.reduce((sum, day) => sum + day.pnl, 0);
  const totalTrades = tradingData.reduce((sum, day) => sum + day.trades, 0);
  const avgWinRate = tradingData.reduce((sum, day) => sum + day.winRate, 0) / tradingData.length;
  const totalVolume = tradingData.reduce((sum, day) => sum + day.volume, 0);

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 80) return 'text-green-400';
    if (winRate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Trading Analytics
                </h1>
                <p className="text-gray-300">
                  Detailed performance insights and trading patterns
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className={`text-2xl font-bold ${getPnLColor(totalPnL)}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Total PnL</h3>
            <p className="text-gray-400 text-sm">All time profit/loss</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{totalTrades}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Total Trades</h3>
            <p className="text-gray-400 text-sm">Trading activity</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <span className={`text-2xl font-bold ${getWinRateColor(avgWinRate)}`}>
                {avgWinRate.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Win Rate</h3>
            <p className="text-gray-400 text-sm">Average success rate</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">${formatNumber(totalVolume)}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Total Volume</h3>
            <p className="text-gray-400 text-sm">Trading volume</p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* PnL Chart */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Daily PnL</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              {tradingData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${day.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(day.pnl) / 2, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`font-semibold ${getPnLColor(day.pnl)}`}>
                    {day.pnl >= 0 ? '+' : ''}${day.pnl.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Win Rate Chart */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Daily Win Rate</h3>
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {tradingData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getWinRateColor(day.winRate)}`}
                        style={{ width: `${day.winRate}%` }}
                      />
                    </div>
                  </div>
                  <span className={`font-semibold ${getWinRateColor(day.winRate)}`}>
                    {day.winRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Token Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Token Performance</h3>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Token</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Volume</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg PnL</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Trade</th>
                </tr>
              </thead>
              <tbody>
                {tokenPerformance.map((token, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-gray-400 text-sm">{token.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{token.totalTrades}</td>
                    <td className="py-3 px-4 text-white">${formatNumber(token.totalVolume)}</td>
                    <td className={`py-3 px-4 font-medium ${getPnLColor(token.avgPnL)}`}>
                      {token.avgPnL >= 0 ? '+' : ''}${token.avgPnL.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 font-medium ${getWinRateColor(token.winRate)}`}>
                      {token.winRate}%
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatTimeAgo(token.lastTrade)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 