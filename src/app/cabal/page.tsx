"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { Modal } from '@/components/ui/modal';
import { formatNumber } from '@/lib/utils';
import { Cabal, User } from '@/types';
import { 
  Users, 
  ArrowRight,
  Plus
} from 'lucide-react';

// Mock data
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
    members: ['user4', 'user5', 'user6'],
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
    members: Array.from({ length: 25 }, (_, i) => `user${i + 7}`),
    totalCabalPoints: 8900,
    leader: 'user6',
    memberCount: 25,
    isFull: true,
    createdAt: new Date('2024-02-01'),
    createdBy: 'user6'
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

    setCabals(mockCabals);
    setUser(mockUser);
  }, [connected, router]);

  const filteredCabals = cabals.filter(cabal => {
    const matchesSearch = cabal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterMinPoints || cabal.minCabalPoints <= filterMinPoints;
    return matchesSearch && matchesFilter;
  });

  const canJoinCabal = (cabal: Cabal) => {
    if (!user) return false;
    
    // User must not be in any cabal
    if (user.cabalId) return false;
    
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

  const handleCreateCabal = (formData: FormData) => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const minPoints = parseInt(formData.get('minPoints') as string);
    const icon = formData.get('icon') as string;

    const newCabal: Cabal = {
      id: Date.now().toString(),
      name,
      description,
      minCabalPoints: minPoints,
      icon,
      members: [user!.id],
      totalCabalPoints: user!.cabalPoints,
      leader: user!.walletAddress,
      memberCount: 1,
      isFull: false,
      createdAt: new Date(),
      createdBy: user!.id
    };

    setCabals([newCabal, ...cabals]);
    setUser({ ...user!, cabalId: newCabal.id, isCabalLeader: true });
    setIsCreateModalOpen(false);
  };

  const handleJoinCabal = (cabalId: string) => {
    if (!user) return;
    
    setCabals(cabals.map(cabal => 
      cabal.id === cabalId 
        ? { 
            ...cabal, 
            members: [...cabal.members, user.id],
            memberCount: cabal.memberCount + 1,
            isFull: cabal.memberCount + 1 >= 25
          }
        : cabal
    ));
    
    setUser({ ...user, cabalId });
  };

  const handleLeaveCabal = () => {
    if (!user?.cabalId) return;
    
    setCabals(cabals.map(cabal => 
      cabal.id === user.cabalId 
        ? { 
            ...cabal, 
            members: cabal.members.filter(memberId => memberId !== user.id),
            memberCount: cabal.memberCount - 1,
            isFull: false
          }
        : cabal
    ));
    
    setUser({ ...user, cabalId: undefined, isCabalLeader: false });
  };

  const handleKickMember = (memberId: string) => {
    if (!user?.cabalId || !user?.isCabalLeader) return;
    
    setCabals(cabals.map(cabal => 
      cabal.id === user.cabalId 
        ? { 
            ...cabal, 
            members: cabal.members.filter(id => id !== memberId),
            memberCount: cabal.memberCount - 1,
            isFull: false
          }
        : cabal
    ));
  };

  if (!connected || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading cabals...</p>
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
          {filteredCabals.map((cabal, index) => (
            <motion.div
              key={cabal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
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
              ) : user?.cabalId ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-500/20 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                >
                  Leave Current Cabal First
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
          ))}
        </div>

        {/* Create Cabal Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Cabal"
        >
          <form action={handleCreateCabal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cabal Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter cabal name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Describe your cabal"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Cabal Points
              </label>
              <input
                type="number"
                name="minPoints"
                required
                min="0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon (emoji)
              </label>
              <input
                type="text"
                name="icon"
                required
                maxLength={2}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-center text-2xl"
                placeholder="🔥"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Create Cabal
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
} 