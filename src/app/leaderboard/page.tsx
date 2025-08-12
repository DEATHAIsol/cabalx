"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatAddress, formatNumber } from '@/lib/utils';
import { User, Cabal } from '@/types';
import { 
  Trophy, 
  Crown, 
  TrendingUp, 
  Users, 
  Medal,
  Star
} from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    username: 'crypto_king',
    displayName: 'Crypto King',
    bio: 'Elite Solana trader and memecoin enthusiast',
    profileImageUrl: 'https://example.com/avatar.jpg',
    cabalPoints: 2847,
    totalPnL: 156.7,
    winRate: 68.5,
    totalTrades: 127,
    winningTrades: 87,
    badges: [],
    cabalId: '1',
    isCabalLeader: true,
    dmPrefs: { allowFrom: 'everyone' },
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  },
  {
    id: '2',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    username: 'solana_sage',
    displayName: 'Solana Sage',
    bio: 'Wisdom and strategy in Solana trading',
    profileImageUrl: 'https://example.com/sage.jpg',
    cabalPoints: 3421,
    totalPnL: 234.5,
    winRate: 72.3,
    totalTrades: 89,
    winningTrades: 64,
    badges: [],
    cabalId: '2',
    isCabalLeader: false,
    dmPrefs: { allowFrom: 'cabal' },
    createdAt: new Date('2024-01-05'),
    lastActive: new Date()
  },
  {
    id: '3',
    walletAddress: '3xJ8tCKCjXwXrN7CgM9E1qL2pO8sR4tU6vW9xY0zA1bC',
    username: 'meme_lord',
    displayName: 'Meme Lord',
    bio: 'Kings of the meme coin game',
    profileImageUrl: 'https://example.com/meme.jpg',
    cabalPoints: 1987,
    totalPnL: 89.2,
    winRate: 65.1,
    totalTrades: 156,
    winningTrades: 102,
    badges: [],
    cabalId: '3',
    isCabalLeader: true,
    dmPrefs: { allowFrom: 'everyone' },
    createdAt: new Date('2024-01-10'),
    lastActive: new Date()
  }
];

const mockCabals: Cabal[] = [
  {
    id: '1',
    name: 'Degen Masters',
    description: 'Elite traders who hunt the biggest gains',
    minCabalPoints: 2000,
    icon: '🔥',
    members: ['user1', 'user2', 'user3'],
    totalCabalPoints: 15420,
    leader: 'user1',
    memberCount: 3,
    isFull: false,
    createdAt: new Date('2024-01-01'),
    createdBy: 'user1'
  },
  {
    id: '2',
    name: 'Solana Sages',
    description: 'Wisdom and strategy in Solana trading',
    minCabalPoints: 1500,
    icon: '🧙‍♂️',
    members: ['user1', 'user4', 'user5'],
    totalCabalPoints: 12340,
    leader: 'user4',
    memberCount: 3,
    isFull: false,
    createdAt: new Date('2024-01-15'),
    createdBy: 'user4'
  },
  {
    id: '3',
    name: 'Meme Lords',
    description: 'Kings of the meme coin game',
    minCabalPoints: 3000,
    icon: '👑',
    members: ['user6', 'user7'],
    totalCabalPoints: 8900,
    leader: 'user6',
    memberCount: 2,
    isFull: false,
    createdAt: new Date('2024-02-01'),
    createdBy: 'user6'
  }
];

export default function LeaderboardPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [cabals, setCabals] = useState<Cabal[]>([]);
  const [activeTab, setActiveTab] = useState<'traders' | 'cabals'>('traders');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Simulate API call delay
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers.sort((a, b) => b.cabalPoints - a.cabalPoints));
      setCabals(mockCabals.sort((a, b) => b.totalCabalPoints - a.totalCabalPoints));
      setIsLoading(false);
    };

    loadData();
  }, [connected, router]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Star className="w-6 h-6 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view the leaderboard.</p>
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
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-gray-300">
              Top traders and cabals ranked by Cabal Points and performance
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('traders')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'traders'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Top Traders</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cabals')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'cabals'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Top Cabals</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Leaderboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading leaderboard data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'traders' ? (
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        if (user.username) {
                          router.push(`/u/${user.username}`);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full">
                            {getRankIcon(index + 1)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                              {user.displayName || user.username || formatAddress(user.walletAddress)}
                              {user.isCabalLeader && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {user.username ? `@${user.username}` : formatAddress(user.walletAddress)} • {user.totalTrades} trades • {user.winRate.toFixed(1)}% win rate
                              {user.cabalId && (
                                <span className="ml-2 text-purple-400">
                                  • {cabals.find(c => c.id === user.cabalId)?.name || 'Cabal Member'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Crown className="w-5 h-5 text-purple-400" />
                            <span className="text-2xl font-bold text-purple-400">
                              {formatNumber(user.cabalPoints)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">
                              +${user.totalPnL.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cabals.map((cabal, index) => (
                    <motion.div
                      key={cabal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full">
                            {getRankIcon(index + 1)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{cabal.icon}</div>
                            <div>
                              <h3 className="text-lg font-bold text-white">
                                {cabal.name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {cabal.memberCount} members • Min {formatNumber(cabal.minCabalPoints)} CP
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Crown className="w-5 h-5 text-purple-400" />
                            <span className="text-2xl font-bold text-purple-400">
                              {formatNumber(cabal.totalCabalPoints)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">Total CP</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {users.length}
            </div>
            <p className="text-gray-300">Active Traders</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {cabals.length}
            </div>
            <p className="text-gray-300">Total Cabals</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatNumber(users.reduce((sum, user) => sum + user.cabalPoints, 0))}
            </div>
            <p className="text-gray-300">Total CP Earned</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 