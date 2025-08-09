"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/stats-card';
import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/utils';
import { User } from '@/types';
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
  Clock
} from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';

// Mock data for development
const mockUser: User = {
  id: '1',
  walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  cabalPoints: 2847,
  totalPnL: 156.7,
  winRate: 68.5,
  totalTrades: 127,
  winningTrades: 87,
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
};

// Mock trading feed data
const mockTradingFeed = [
  {
    id: '1',
    userWallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    userName: '9WzD...AWWM',
    tokenSymbol: 'BONK',
    tokenName: 'Bonk',
    action: 'buy',
    amount: 1000000,
    price: 0.00000123,
    pnl: 0,
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    cabalName: 'Degen Masters'
  },
  {
    id: '2',
    userWallet: '2WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    userName: '2WzD...AWWM',
    tokenSymbol: 'WIF',
    tokenName: 'dogwifhat',
    action: 'sell',
    amount: 500,
    price: 2.45,
    pnl: 125.50,
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    cabalName: 'Solana Sages'
  },
  {
    id: '3',
    userWallet: '3WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    userName: '3WzD...AWWM',
    tokenSymbol: 'POPCAT',
    tokenName: 'Popcat',
    action: 'buy',
    amount: 50000,
    price: 0.00089,
    pnl: 0,
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    cabalName: 'Meme Lords'
  },
  {
    id: '4',
    userWallet: '4WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    userName: '4WzD...AWWM',
    tokenSymbol: 'BOME',
    tokenName: 'Book of Meme',
    action: 'sell',
    amount: 10000,
    price: 0.0123,
    pnl: -45.20,
    timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
    cabalName: 'Degen Masters'
  }
];

export default function DashboardPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tradingFeed] = useState(mockTradingFeed);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // In a real app, this would fetch user data from the backend
    // For now, we'll use mock data
    setUser(mockUser);
  }, [connected, router]);

  if (!connected || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
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
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {formatAddress(user.walletAddress)}
              </h1>
              <p className="text-gray-300">
                Your trading performance and Cabal Points
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Cabal Points</p>
                <p className="text-2xl font-bold text-purple-400">{formatNumber(user.cabalPoints)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
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

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            Your Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center mb-2">
                  <span className="text-white font-bold text-lg mr-2">{badge.icon}</span>
                  <span className="text-white font-bold text-lg">{badge.name}</span>
                </div>
                <p className="text-gray-300 text-sm">{badge.description}</p>
                <p className="text-gray-400 text-xs mt-2">Rarity: {badge.rarity}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trading Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-400" />
              Live Trading Feed
            </h2>
            <button
              onClick={() => router.push('/trading-feed')}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span className="mr-1">View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tradingFeed.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trade.action === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {trade.action === 'buy' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{trade.tokenSymbol}</span>
                        <span className="text-xs text-gray-400">{trade.tokenName}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          trade.action === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.action.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {trade.userName} • {trade.cabalName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {trade.amount.toLocaleString()} {trade.tokenSymbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${trade.price.toFixed(6)}
                    </div>
                    {trade.pnl !== 0 && (
                      <div className={`text-xs ${
                        trade.pnl > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(trade.timestamp)}
                  </div>
                </div>
              ))}
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