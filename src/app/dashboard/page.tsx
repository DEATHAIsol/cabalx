"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/stats-card';
import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/utils';
import { User } from '@/types';
import { useMetrics } from '@/hooks/useMetrics';
import { 
  Crown, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Activity,
  Users,
  ArrowRight,
  Zap,
  Clock,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';

// Mock user data (for non-metrics fields)
const createMockUser = (walletAddress: string, metrics: any): User => ({
  id: '1',
  walletAddress,
  cabalPoints: metrics?.cabalPoints || 0,
  totalPnL: metrics?.totalPnl || 0,
  winRate: metrics?.winRate || 0,
  totalTrades: metrics?.totalTrades || 0,
  winningTrades: Math.round((metrics?.winRate || 0) * (metrics?.totalTrades || 0) / 100),
  badges: [
    {
      id: '1',
      name: 'First Blood',
      description: 'Completed your first trade',
      icon: '🩸',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Profit Hunter',
      description: 'Achieved 50%+ win rate',
      icon: '🎯',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Cabal Master',
      description: 'Joined 5 exclusive cabals',
      icon: '👑',
      rarity: 'epic'
    }
  ],
  cabalId: '1',
  isCabalLeader: true,
  createdAt: new Date('2024-01-01'),
  lastActive: new Date()
});

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { metrics, loading, error, refetch } = useMetrics();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    if (publicKey && metrics) {
      const mockUser = createMockUser(publicKey.toString(), metrics);
      setUser(mockUser);
    }
  }, [connected, router, publicKey, metrics]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Loading Your Metrics</h2>
              <p className="text-gray-400">Fetching trading data from SolanaTracker...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">No Data Available</h2>
              <p className="text-gray-400 mb-4">Unable to load your trading metrics.</p>
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              <button
                onClick={refetch}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {formatAddress(user.walletAddress)}
              </h1>
              <p className="text-gray-300 mb-1">
                Your trading performance and Cabal Points
              </p>
              {metrics && (
                <p className="text-xs text-gray-500">
                  Last updated: {formatTimeAgo(new Date(metrics.updatedAt))} • Data from {metrics.sourceWindow}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Cabal Points</p>
                <p className="text-2xl font-bold text-purple-400">{formatNumber(user.cabalPoints)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-5 h-5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total PnL"
            value={`$${user.totalPnL.toFixed(2)}`}
            subtitle="All time profit/loss"
            icon={<TrendingUp />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Win Rate"
            value={`${user.winRate}%`}
            subtitle={`${user.winningTrades}/${user.totalTrades} trades`}
            icon={<Target />}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Total Trades"
            value={user.totalTrades}
            subtitle="Lifetime trades"
            icon={<Activity />}
          />
          <StatsCard
            title="Cabals Joined"
            value={user.cabalId ? 1 : 0}
            subtitle="Exclusive communities"
            icon={<Users />}
          />
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/cabal')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-purple-400" />
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join Cabals</h3>
              <p className="text-gray-300 text-sm">Discover and join exclusive trading communities</p>
            </button>

            <button
              onClick={() => router.push('/chat')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <MessageCircle className="w-8 h-8 text-blue-400" />
                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chat</h3>
              <p className="text-gray-300 text-sm">Connect with traders and cabal members</p>
            </button>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">⚔️</span>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cabal Wars</h3>
                <p className="text-gray-300 text-sm">Battle other cabals for prize pools</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/cabal')}
                className="w-full flex items-center justify-between p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
              >
                <span className="text-white font-medium">Browse Cabals</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </button>
              <button
                onClick={() => router.push('/leaderboard')}
                className="w-full flex items-center justify-between p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
              >
                <span className="text-white font-medium">View Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="w-full flex items-center justify-between p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
              >
                <span className="text-white font-medium">Your Profile</span>
                <ArrowRight className="w-4 h-4 text-green-400" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Joined &ldquo;Degen Masters&rdquo; Cabal</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Earned &ldquo;Profit Hunter&rdquo; badge</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Completed daily quest</p>
                  <p className="text-gray-400 text-xs">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 