"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

type TabType = 'profile' | 'tasks-rewards' | 'settings';

export default function ProfilePage() {
  const { connected } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as TabType || 'profile';
  const [user, setUser] = useState<User | null>(null);
  const [joinedCabals, setJoinedCabals] = useState<Cabal[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
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
      setUser(mockUser);
      setJoinedCabals(mockJoinedCabals);
      setTasks(mockTasks);
      setRewards(mockRewards);
      setIsLoading(false);
    };

    loadData();
  }, [connected, router]);

  const handleSaveProfile = async (updatedUser: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
    setIsEditing(false);
  };

  const handleMessageUser = () => {
    router.push('/chat');
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
    const task = tasks.find(t => t.id === taskId);
    if (task && user) {
      setUser(prev => prev ? { ...prev, cabalPoints: prev.cabalPoints + task.cpReward } : null);
    }
  };

  const currentCabal = user?.cabalId ? joinedCabals.find(c => c.id === user.cabalId) : undefined;
  const nextPayoutTime = new Date();
  nextPayoutTime.setHours(nextPayoutTime.getHours() + 6); // 6 hours from now

  if (!connected || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your profile...</p>
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
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              {[
                { id: 'profile' as TabType, label: 'Profile', icon: UserIcon },
                { id: 'tasks-rewards' as TabType, label: 'Tasks & Rewards', icon: Award },
                { id: 'settings' as TabType, label: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isEditing ? (
            <ProfileSettings
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {activeTab === 'profile' && (
                <PublicProfile
                  user={user}
                  cabal={currentCabal}
                  onMessage={handleMessageUser}
                  showWallet={true}
                />
              )}

              {activeTab === 'tasks-rewards' && (
                <div className="space-y-8">
                  {/* Tasks Section */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-400" />
                      My Tasks
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Complete tasks to earn Cabal Points and unlock rewards.
                    </p>
                    
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-white/5 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : tasks.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                              task.completed
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{task.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-white">{task.title}</h3>
                                    {task.completed && (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400">{task.description}</p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Crown className="w-4 h-4 text-purple-400" />
                                  <span className="text-purple-400 font-semibold">+{task.cpReward} CP</span>
                                </div>
                                {!task.completed && (
                                  <button
                                    onClick={() => handleCompleteTask(task.id)}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No tasks available right now.</p>
                      </div>
                    )}
                  </div>

                  {/* Rewards Section */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-400" />
                      My Rewards
                    </h2>
                    
                    {currentCabal ? (
                      <div className="space-y-6">
                        {/* Next Payout */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">Next Payout</h3>
                            <div className="flex items-center space-x-2 text-yellow-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">6h 23m</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Based on your current position in {currentCabal.name}
                          </p>
                        </div>

                        {/* Recent Payouts */}
                        {rewards.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-white mb-3">Recent Payouts</h3>
                            <div className="space-y-3">
                              {rewards.slice(0, 3).map((reward) => (
                                <div key={reward.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                  <div>
                                    <p className="text-white font-medium">{reward.cabalName}</p>
                                    <p className="text-sm text-gray-400">
                                      {reward.distributedAt.toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-yellow-400 font-semibold">+{reward.tokenAmount} SOL</p>
                                    <p className="text-sm text-gray-400">Rank #{reward.rank}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cabal Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-purple-400">{currentCabal.totalCabalPoints.toLocaleString()}</p>
                            <p className="text-sm text-gray-400">Total CP</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-blue-400">{currentCabal.memberCount}</p>
                            <p className="text-sm text-gray-400">Members</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Join a Cabal to start earning rewards.</p>
                        <button
                          onClick={() => router.push('/cabal')}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          Browse Cabals
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
                  <p className="text-gray-400 mb-6">
                    Manage your account preferences and privacy settings.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">Direct Messages</h3>
                        <p className="text-sm text-gray-400">
                          {user.dmPrefs?.allowFrom === 'everyone' && 'Everyone can message you'}
                          {user.dmPrefs?.allowFrom === 'cabal' && 'Only cabal members can message you'}
                          {user.dmPrefs?.allowFrom === 'nobody' && 'Nobody can message you'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Change
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">Profile Visibility</h3>
                        <p className="text-sm text-gray-400">Your profile is public</p>
                      </div>
                      <div className="text-green-400 text-sm">Public</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 