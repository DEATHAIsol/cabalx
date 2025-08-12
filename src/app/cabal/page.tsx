"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { CreateCabalModal } from '@/components/cabal/CreateCabalModal';
import { formatNumber } from '@/lib/utils';
import { Cabal, User } from '@/types';
import { 
  Users, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { firebaseApi } from '@/lib/firebase-api';

// Mock data
const mockCabals: Cabal[] = [
  {
    id: '1',
    name: 'Degen Masters',
    description: 'Elite traders who hunt the biggest gains',
    minCabalPoints: 2000,
    icon: '🔥',
    leaderWallet: 'user1',
    leaderUserId: 'user1',
    totalCabalPoints: 15420,
    memberCount: 3,
    isFull: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Solana Sages',
    description: 'Wisdom and strategy in Solana trading',
    minCabalPoints: 1500,
    icon: '🧙‍♂️',
    leaderWallet: 'user4',
    leaderUserId: 'user4',
    totalCabalPoints: 12340,
    memberCount: 3,
    isFull: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Meme Lords',
    description: 'Kings of the meme coin game',
    minCabalPoints: 3000,
    icon: '👑',
    leaderWallet: 'user6',
    leaderUserId: 'user6',
    totalCabalPoints: 8900,
    memberCount: 25,
    isFull: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

const mockUser: User = {
  id: '1',
  walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  cabalPoints: 2847,
  totalPnL: 156.7,
  winRate: 68.5,
  totalTrades: 127,
  winningTrades: 87,
  badges: [],
  cabalId: '1', // User is in cabal 1
  isCabalLeader: true, // User is the leader
  createdAt: new Date('2024-01-01'),
  lastActive: new Date()
};

export default function CabalPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [cabals, setCabals] = useState<Cabal[]>([]);
  const [user, setUser] = useState<User | null>(null); // Changed to any as User type is removed
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMinPoints, setFilterMinPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        // Load cabals from Firebase
        const cabalsData = await firebaseApi.getCabals();
        console.log('Loaded cabals from Firebase:', cabalsData);
        
        // Filter out empty cabals (they should be automatically deleted, but just in case)
        const nonEmptyCabals = cabalsData.filter(cabal => cabal.memberCount > 0);
        setCabals(nonEmptyCabals);
        
        // For now, create a test user that's not in any cabal
        // In real implementation, this would come from Firebase user data
        const testUser = {
          id: 'test-user',
          walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          cabalPoints: 2847,
          totalPnL: 156.7,
          winRate: 68.5,
          totalTrades: 127,
          winningTrades: 87,
          badges: [],
          cabalId: undefined, // Not in any cabal
          isCabalLeader: false,
          createdAt: new Date('2024-01-01'),
          lastActive: new Date()
        };
        
        setUser(testUser);
      } catch (error) {
        console.error('Error loading data:', error);
        // If no cabals exist yet, show empty state
        setCabals([]);
        
        // Create a test user that's not in any cabal
        const testUser = {
          id: 'test-user',
          walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          cabalPoints: 2847,
          totalPnL: 156.7,
          winRate: 68.5,
          totalTrades: 127,
          winningTrades: 87,
          badges: [],
          cabalId: undefined, // Not in any cabal
          isCabalLeader: false,
          createdAt: new Date('2024-01-01'),
          lastActive: new Date()
        };
        
        setUser(testUser);
      }
    };

    loadData();
  }, [connected, router]);

  const filteredCabals = cabals.filter(cabal => {
    const matchesSearch = cabal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterMinPoints || cabal.minCabalPoints <= filterMinPoints;
    return matchesSearch && matchesFilter;
  });

  const canJoinCabal = (cabal: Cabal) => {
    if (!user) return false;
    
    // User must not be in any cabal (check for truthy values)
    if (user.cabalId && user.cabalId !== undefined && user.cabalId !== null) return false;
    
    // User must meet minimum CP requirement
    if (user.cabalPoints < cabal.minCabalPoints) return false;
    
    // Cabal must not be full
    if (cabal.isFull) return false;
    
    return true;
  };

  const isUserInCabal = (cabal: Cabal) => {
    return user?.cabalId === cabal.id;
  };

  const isUserLeader = (cabal: Cabal) => {
    return user?.isCabalLeader && user?.cabalId === cabal.id;
  };

  const handleCreateCabal = async (cabalId: string) => {
    if (!user || !connected) return;

    try {
      // Refresh cabals list
      const updatedCabals = await firebaseApi.getCabals();
      setCabals(updatedCabals);
      
      // Update user state
      setUser({ ...user, cabalId, isCabalLeader: true });
      
      // Close modal
      setIsCreateModalOpen(false);
      
      // Redirect to cabal page
      router.push(`/cabal/${cabalId}`);
    } catch (error) {
      console.error('Error handling cabal creation:', error);
      // TODO: Add error handling UI
    }
  };

  const handleLeaveCurrentCabal = async () => {
    if (!user?.cabalId) return;
    
    try {
      await firebaseApi.leaveCabal(user.cabalId, user.walletAddress);
      
      // Refresh cabals list
      const updatedCabals = await firebaseApi.getCabals();
      setCabals(updatedCabals);
      
      // Update user state
      setUser({ ...user, cabalId: undefined, isCabalLeader: false });
    } catch (error) {
      console.error('Error leaving current cabal:', error);
      // TODO: Add error handling UI
    }
  };

  const handleJoinCabal = async (cabalId: string) => {
    if (!user) return;
    
    // If user is already in a cabal, leave it first
    if (user.cabalId && user.cabalId !== cabalId) {
      await handleLeaveCurrentCabal();
    }
    
    try {
      await firebaseApi.joinCabal(cabalId, user.walletAddress);
      
      // Refresh cabals list
      const updatedCabals = await firebaseApi.getCabals();
      setCabals(updatedCabals);
      
      // Update user state
      setUser({ ...user, cabalId });
    } catch (error) {
      console.error('Error joining cabal:', error);
      // TODO: Add error handling UI
    }
  };

  const handleLeaveCabal = async () => {
    if (!user?.cabalId) return;
    
    try {
      await firebaseApi.leaveCabal(user.cabalId, user.walletAddress);
      
      // Refresh cabals list
      const updatedCabals = await firebaseApi.getCabals();
      setCabals(updatedCabals);
      
      // Update user state
      setUser({ ...user, cabalId: undefined, isCabalLeader: false });
    } catch (error) {
      console.error('Error leaving cabal:', error);
      // TODO: Add error handling UI
    }
  };

  const handleKickMember = async (memberId: string) => {
    if (!user?.cabalId || !user?.isCabalLeader) return;
    
    try {
      // TODO: Implement kick member functionality in Firebase API
      console.log('Kicking member:', memberId, 'from cabal:', user.cabalId);
      
      // Refresh cabals list
      const updatedCabals = await firebaseApi.getCabals();
      setCabals(updatedCabals);
    } catch (error) {
      console.error('Error kicking member:', error);
      // TODO: Add error handling UI
    }
  };

  if (!connected || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading cabals...</p>
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
              <h1 className="text-4xl font-bold text-white mb-2">Cabals</h1>
              <p className="text-gray-300">
                Join exclusive trading communities or create your own
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create Cabal</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search cabals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterMinPoints || ''}
            onChange={(e) => setFilterMinPoints(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Cabals</option>
            <option value="1000">1000+ CP</option>
            <option value="2000">2000+ CP</option>
            <option value="3000">3000+ CP</option>
          </select>
        </motion.div>

        {/* Cabals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCabals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-800/50 rounded-lg p-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Cabals Found</h3>
                <p className="text-gray-400 mb-6">
                  {cabals.length === 0 
                    ? "No cabals exist yet. Be the first to create one!"
                    : "No cabals match your search criteria."
                  }
                </p>
                {cabals.length === 0 && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create First Cabal</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await firebaseApi.createTestData();
                          // Reload the page to show the new data
                          window.location.reload();
                        } catch (error) {
                          console.error('Error creating test data:', error);
                        }
                      }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
                    >
                      <span>Create Test Data</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            filteredCabals.map((cabal) => (
              <motion.div
                key={cabal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{cabal.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{cabal.name}</h3>
                    <p className="text-gray-400 text-sm">{cabal.description}</p>
                  </div>
                </div>
                {isUserInCabal(cabal) && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Member
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Min CP Required</span>
                  <span className="text-white font-semibold">{formatNumber(cabal.minCabalPoints)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Members</span>
                  <span className="text-white font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {cabal.memberCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total CP</span>
                  <span className="text-purple-400 font-semibold">{formatNumber(cabal.totalCabalPoints)}</span>
                </div>
              </div>

              {isUserInCabal(cabal) ? (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => router.push(`/cabal/${cabal.id}`)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold rounded-lg transition-colors"
                  >
                    <span>Enter Cabal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {isUserLeader(cabal) && (
                    <button
                      onClick={() => handleLeaveCabal()}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors"
                    >
                      <span>Leave Cabal</span>
                    </button>
                  )}
                  {isUserLeader(cabal) && (
                    <button
                      onClick={() => handleKickMember(user!.id)}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors"
                    >
                      <span>Kick Member</span>
                    </button>
                  )}
                </div>
              ) : canJoinCabal(cabal) ? (
                <button
                  onClick={() => handleJoinCabal(cabal.id)}
                  className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold rounded-lg transition-colors"
                >
                  Join Cabal
                </button>
              ) : user?.cabalId && user.cabalId !== cabal.id ? (
                <button
                  onClick={handleLeaveCurrentCabal}
                  className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors"
                >
                  Leave Current Cabal
                </button>
              ) : cabal.isFull ? (
                <button
                  disabled
                  className="w-full py-3 bg-red-500/20 text-red-400 font-semibold rounded-lg cursor-not-allowed"
                >
                  Cabal Full (25/25)
                </button>
              ) : user && user.cabalPoints < cabal.minCabalPoints ? (
                <button
                  disabled
                  className="w-full py-3 bg-yellow-500/20 text-yellow-400 font-semibold rounded-lg cursor-not-allowed"
                >
                  Need {formatNumber(cabal.minCabalPoints - user.cabalPoints)} More CP
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-gray-500/20 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                >
                  Cannot Join
                </button>
              )}
            </motion.div>
          ))
        )}
        </div>

        {/* Create Cabal Modal */}
        <CreateCabalModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateCabal}
          currentUser={user}
        />
      </div>
    </div>
  );
} 