"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { PublicProfile } from '@/components/ui/public-profile';
import { User, Cabal } from '@/types';
import { 
  ArrowLeft,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

// Mock data for public profiles
const mockUsers: Record<string, User> = {
  'crypto_king': {
    id: '1',
    walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    username: 'crypto_king',
    displayName: 'Crypto King',
    bio: 'Elite Solana trader and memecoin enthusiast. Always hunting for the next big pump! 🚀',
    profileImageUrl: 'https://example.com/avatar.jpg',
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
    dmPrefs: { allowFrom: 'everyone' },
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  },
  'solana_sage': {
    id: '2',
    walletAddress: '2WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    username: 'solana_sage',
    displayName: 'Solana Sage',
    bio: 'Wisdom and strategy in Solana trading. Sharing insights and helping others succeed.',
    profileImageUrl: 'https://example.com/sage.jpg',
    cabalPoints: 1890,
    totalPnL: 89.3,
    winRate: 72.1,
    totalTrades: 95,
    winningTrades: 68,
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
      }
    ],
    cabalId: '2',
    isCabalLeader: false,
    dmPrefs: { allowFrom: 'cabal' },
    createdAt: new Date('2024-01-15'),
    lastActive: new Date()
  }
};

const mockCabals: Record<string, Cabal> = {
  '1': {
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
  '2': {
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
  }
};

export default function PublicProfilePage() {
  const { connected } = useWallet();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [cabal, setCabal] = useState<Cabal | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username as string;

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if username exists in mock data
        const foundUser = mockUsers[username];
        
        if (!foundUser) {
          // Check if it's a wallet address
          if (username.length === 44) {
            // This would be a wallet address lookup
            setError('User not found');
            return;
          }
          setError('User not found');
          return;
        }

        setUser(foundUser);

        // Load cabal info if user is in a cabal
        if (foundUser.cabalId) {
          const userCabal = mockCabals[foundUser.cabalId];
          if (userCabal) {
            setCabal(userCabal);
          }
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  const handleMessageUser = () => {
    if (!connected) {
      router.push('/');
      return;
    }
    
    // Navigate to chat with this user
    router.push(`/chat?user=${username}`);
  };

  const canMessageUser = () => {
    if (!user || !connected) return false;
    
    // Check DM preferences
    if (user.dmPrefs?.allowFrom === 'nobody') return false;
    if (user.dmPrefs?.allowFrom === 'cabal' && !cabal) return false;
    
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">
            <div className="mb-4">
              <ArrowLeft className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
            <p className="text-gray-400 mb-6">
              The user you&apos;re looking for doesn&apos;t exist or has a private profile.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.displayName || user.username}
              </h1>
              <p className="text-gray-300">
                @{user.username} • Member since {user.createdAt.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PublicProfile
            user={user}
            cabal={cabal}
            onMessage={canMessageUser() ? handleMessageUser : undefined}
            showWallet={false}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-center space-x-4"
        >
          {canMessageUser() ? (
            <button
              onClick={handleMessageUser}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                {user.dmPrefs?.allowFrom === 'nobody' 
                  ? 'This user has disabled direct messages'
                  : user.dmPrefs?.allowFrom === 'cabal' && !cabal
                  ? 'This user only accepts messages from cabal members'
                  : 'Connect your wallet to send messages'
                }
              </p>
            </div>
          )}
          
          <button
            onClick={() => window.open(`https://solscan.io/account/${user.walletAddress}`, '_blank')}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View on Solscan</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
} 