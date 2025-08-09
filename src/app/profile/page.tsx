"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ProfileSettings } from '@/components/ui/profile-settings';
import { PublicProfile } from '@/components/ui/public-profile';
import { User, Cabal, Task, Reward } from '@/types';
import { 
  Crown, 
  Target, 
  ArrowLeft,
  Settings,
  User as UserIcon,
  Award,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';

// Mock data with new fields
const mockUser: User = {
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
    },
    {
      id: '4',
      name: 'Degen Legend',
      description: 'Earned 1000+ Cabal Points',
      icon: '🔥',
      rarity: 'legendary'
    }
  ],
  cabalId: '1',
  isCabalLeader: true,
  dmPrefs: {
    allowFrom: 'everyone'
  },
  createdAt: new Date('2024-01-01'),
  lastActive: new Date()
};

const mockJoinedCabals: Cabal[] = [
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
  }
];

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Daily Login',
    description: 'Log in to CabalX today',
    cpReward: 50,
    type: 'daily_login',
    status: 'active',
    isOneTime: false,
    icon: '🎯',
    completed: false
  },
  {
    id: '2',
    title: 'Complete 3 Trades',
    description: 'Execute 3 successful trades today',
    cpReward: 150,
    type: 'custom',
    status: 'active',
    isOneTime: false,
    icon: '📈',
    completed: false
  },
  {
    id: '3',
    title: 'Join Discord',
    description: 'Join the official CabalX Discord server',
    cpReward: 100,
    type: 'discord_join',
    status: 'active',
    isOneTime: true,
    icon: '💬',
    completed: false,
    externalUrl: 'https://discord.gg/cabalx'
  },
  {
    id: '4',
    title: 'Refer a Friend',
    description: 'Invite a friend to join CabalX',
    cpReward: 200,
    type: 'referral',
    status: 'active',
    isOneTime: false,
    icon: '👥',
    completed: false
  }
];

// Mock rewards data
const mockRewards: Reward[] = [
  {
    id: '1',
    cabalId: '1',
    cabalName: 'Degen Masters',
    totalCP: 15420,
    rank: 1,
    tokenAmount: 0.5,
    distributionPeriod: '2024-01-15',
    distributedAt: new Date('2024-01-15T12:00:00Z'),
    status: 'distributed'
  },
  {
    id: '2',
    cabalId: '1',
    cabalName: 'Degen Masters',
    totalCP: 16200,
    rank: 1,
    tokenAmount: 0.6,
    distributionPeriod: '2024-01-16',
    distributedAt: new Date('2024-01-16T12:00:00Z'),
    status: 'distributed'
  }
];

// Profile content component that uses useSearchParams
const ProfileContent = () => {
  const { connected } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [cabal, setCabal] = useState<Cabal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Get initial tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Simulate loading user data
    setTimeout(() => {
      setUser(mockUser);
      setCabal(mockJoinedCabals[0]); // Assuming the first joined cabal is the current one
      setTasks(mockTasks);
      setRewards(mockRewards);
      setIsLoading(false);
    }, 1000);
  }, [connected, router]);

  const handleSaveProfile = async (updatedUser: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
    setIsEditing(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, completedAt: new Date() }
        : task
    ));
    // Update user CP
    setUser(prev => prev ? { ...prev, cabalPoints: prev.cabalPoints + 50 } : null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">User not found</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go to Dashboard
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
                  {isEditing ? 'Edit Profile' : 'My Profile'}
                </h1>
                <p className="text-gray-300">
                  {isEditing ? 'Update your profile information' : 'Manage your profile, tasks, and rewards'}
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEditing ? (
            <ProfileSettings
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <PublicProfile
                  user={user}
                  cabal={cabal || undefined}
                  showWallet={true}
                />
              </div>

              {/* Tabs Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
                    {[
                      { id: 'overview', name: 'Overview', icon: UserIcon },
                      { id: 'tasks-rewards', name: 'Tasks & Rewards', icon: Award }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-white text-sm">Completed daily quest</p>
                                <p className="text-gray-400 text-xs">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-white text-sm">Earned 50 CP for winning trade</p>
                                <p className="text-gray-400 text-xs">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-white text-sm">Joined "Degen Masters" Cabal</p>
                                <p className="text-gray-400 text-xs">3 days ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'tasks-rewards' && (
                      <div className="space-y-6">
                        {/* Tasks Section */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-4">Active Tasks</h3>
                          <div className="space-y-3">
                            {tasks.filter(task => !task.completed).map((task) => (
                              <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Target className="w-5 h-5 text-purple-400" />
                                  <div>
                                    <p className="text-white font-medium">{task.title}</p>
                                    <p className="text-gray-400 text-sm">{task.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-yellow-400 text-sm font-medium">+{task.cpReward} CP</span>
                                  <button
                                    onClick={() => handleCompleteTask(task.id)}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                  >
                                    Complete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rewards Section */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-4">Recent Rewards</h3>
                          <div className="space-y-3">
                            {rewards.slice(0, 3).map((reward) => (
                              <div key={reward.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Award className="w-5 h-5 text-yellow-400" />
                                  <div>
                                    <p className="text-white font-medium">{reward.cabalName}</p>
                                    <p className="text-gray-400 text-sm">Rank #{reward.rank}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-medium">+{reward.tokenAmount} SOL</p>
                                  <p className="text-gray-400 text-sm">{reward.distributedAt.toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Main page component with Suspense
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
} 