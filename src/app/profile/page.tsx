"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { firebaseApi } from '@/lib/firebase-api';
import { User } from '@/types';
import { 
  User as UserIcon,
  Edit,
  Save,
  X,
  Search,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Trophy,
  TrendingUp,
  Users,
  MessageCircle
} from 'lucide-react';

function ProfilePageContent() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, updateUser } = useCurrentUser();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get username from URL params for viewing other profiles
  const profileUsername = searchParams.get('u');
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Load profile data
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setDisplayName(currentUser.displayName || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  // Load other user's profile if username provided
  useEffect(() => {
    if (profileUsername && profileUsername !== currentUser?.username) {
      loadUserProfile(profileUsername);
    }
  }, [profileUsername, currentUser]);

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  const loadUserProfile = async (username: string) => {
    try {
      const users = await firebaseApi.searchUsers(username);
      const user = users.find(u => u.username === username);
      if (user) {
        setViewingUser(user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const users = await firebaseApi.searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const saveProfile = async () => {
    if (!currentUser || !username.trim()) return;

    try {
      setSaving(true);
      await firebaseApi.upsertUser({
        ...currentUser,
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim()
      });
      
      // Update local state
      await updateUser({
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim()
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const copyWalletAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startDM = (username: string) => {
    router.push(`/chat?c=dm&u=${username}`);
  };

  const viewProfile = (username: string) => {
    router.push(`/profile?u=${username}`);
  };

  const userToDisplay = viewingUser || currentUser;

  if (!connected || !userToDisplay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your profile.</p>
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
              <h1 className="text-3xl font-bold text-white">
                {viewingUser ? `${viewingUser.displayName || viewingUser.username}'s Profile` : 'My Profile'}
              </h1>
              <p className="text-gray-300">
                {viewingUser ? 'View user profile and stats' : 'Manage your profile and settings'}
              </p>
            </div>
            {!viewingUser && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {userToDisplay?.displayName?.[0] || userToDisplay?.username?.[0] || 'U'}
                  </span>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {isEditing && !viewingUser ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter display name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={saveProfile}
                          disabled={saving || !username.trim()}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {userToDisplay?.displayName || userToDisplay?.username || 'Anonymous'}
                      </h2>
                      <p className="text-gray-400 mb-2">@{userToDisplay?.username || 'username'}</p>
                      {userToDisplay?.bio && (
                        <p className="text-gray-300 mb-4">{userToDisplay.bio}</p>
                      )}
                      
                      {/* Wallet Address */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-400">Wallet:</span>
                        <code className="text-sm bg-black/20 px-2 py-1 rounded text-gray-300">
                          {userToDisplay?.walletAddress?.slice(0, 8)}...{userToDisplay?.walletAddress?.slice(-8)}
                        </code>
                        {!viewingUser && (
                          <button
                            onClick={copyWalletAddress}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {viewingUser && viewingUser.id !== currentUser?.id && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => startDM(viewingUser.username || '')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userToDisplay?.cabalPoints || 0}</div>
                <div className="text-sm text-gray-400">Cabal Points</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">${userToDisplay?.totalPnL || 0}</div>
                <div className="text-sm text-gray-400">Total PnL</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userToDisplay?.winRate || 0}%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userToDisplay?.totalTrades || 0}</div>
                <div className="text-sm text-gray-400">Total Trades</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Search & Actions */}
          <div className="space-y-6">
            {/* User Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search Users</span>
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by username or wallet..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {isSearching && (
                  <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.displayName?.[0] || user.username?.[0] || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user.displayName || user.username}
                            </div>
                            <div className="text-gray-400 text-sm">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewProfile(user.username || '')}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => startDM(user.username || '')}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            {!viewingUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
              >
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/chat')}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Go to Chat</span>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Dashboard</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfilePageContent />
      </Suspense>
    </>
  );
} 