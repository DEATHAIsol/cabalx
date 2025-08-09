"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatNumber } from '@/lib/utils';
import { Cabal, User, ChatMessage } from '@/types';
import { 
  Users, 
  Crown, 
  MessageSquare, 
  Send, 
  UserX, 
  LogOut,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockCabal: Cabal = {
  id: '1',
  name: 'Degen Masters',
  description: 'Elite traders who hunt the biggest gains',
  minCabalPoints: 2000,
  icon: '🔥',
  members: ['user1', 'user2', 'user3', 'user4', 'user5'],
  totalCabalPoints: 15420,
  leader: 'user1',
  memberCount: 5,
  isFull: false,
  createdAt: new Date('2024-01-01'),
  createdBy: 'user1'
};

const mockMembers: User[] = [
  {
    id: 'user1',
    walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    cabalPoints: 2847,
    totalPnL: 156.7,
    winRate: 68.5,
    totalTrades: 127,
    winningTrades: 87,
    badges: [],
    cabalId: '1',
    isCabalLeader: true,
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  },
  {
    id: 'user2',
    walletAddress: '2WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    cabalPoints: 2156,
    totalPnL: 89.3,
    winRate: 72.1,
    totalTrades: 95,
    winningTrades: 68,
    badges: [],
    cabalId: '1',
    isCabalLeader: false,
    createdAt: new Date('2024-01-02'),
    lastActive: new Date()
  },
  {
    id: 'user3',
    walletAddress: '3WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    cabalPoints: 1890,
    totalPnL: 45.2,
    winRate: 65.8,
    totalTrades: 78,
    winningTrades: 51,
    badges: [],
    cabalId: '1',
    isCabalLeader: false,
    createdAt: new Date('2024-01-03'),
    lastActive: new Date()
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    cabalId: '1',
    senderWallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    senderName: '9WzD...AWWM',
    message: 'Welcome to Degen Masters! 🚀',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    cabalId: '1',
    senderWallet: '2WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    senderName: '2WzD...AWWM',
    message: 'Thanks! Excited to be here 💪',
    timestamp: new Date(Date.now() - 3000000)
  },
  {
    id: '3',
    cabalId: '1',
    senderWallet: '3WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    senderName: '3WzD...AWWM',
    message: 'Anyone trading $BONK today?',
    timestamp: new Date(Date.now() - 1800000)
  }
];

export default function CabalDetailPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const params = useParams();
  const [cabal, setCabal] = useState<Cabal | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Load mock data
    setCabal(mockCabal);
    setMembers(mockMembers);
    setMessages(mockMessages);
    setCurrentUser(mockMembers[0]); // Set first user as current user
  }, [connected, router, params.id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      cabalId: cabal!.id,
      senderWallet: currentUser.walletAddress,
      senderName: formatAddress(currentUser.walletAddress),
      message: newMessage.trim(),
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleKickMember = (memberId: string) => {
    if (!currentUser?.isCabalLeader) return;
    
    setMembers(members.filter(member => member.id !== memberId));
    setCabal(cabal ? { ...cabal, memberCount: cabal.memberCount - 1 } : null);
  };

  const handleLeaveCabal = () => {
    if (!currentUser) return;
    
    // Remove current user from members
    setMembers(members.filter(member => member.id !== currentUser.id));
    setCabal(cabal ? { ...cabal, memberCount: cabal.memberCount - 1 } : null);
    
    // Redirect to cabals page
    router.push('/cabal');
  };

  const isCurrentUserLeader = currentUser?.isCabalLeader;
  const isCurrentUserInCabal = currentUser?.cabalId === cabal?.id;

  if (!connected || !cabal || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading cabal...</p>
        </div>
      </div>
    );
  }

  if (!isCurrentUserInCabal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">You must be a member of this cabal to view it.</p>
          <button
            onClick={() => router.push('/cabal')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Cabals
          </button>
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
                onClick={() => router.push('/cabal')}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{cabal.icon}</div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{cabal.name}</h1>
                  <p className="text-gray-300">{cabal.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-semibold">{cabal.memberCount}/25 Members</div>
                <div className="text-gray-400 text-sm">{formatNumber(cabal.totalCabalPoints)} Total CP</div>
              </div>
              {isCurrentUserLeader && (
                <Badge
                  name="Leader"
                  description="You are the cabal leader"
                  rarity="legendary"
                  icon="👑"
                />
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-[600px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Cabal Chat
                </h2>
                <div className="text-gray-400 text-sm">
                  {messages.length} messages
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderWallet === currentUser.walletAddress ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderWallet === currentUser.walletAddress
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.senderName}
                        </span>
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Members Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Members ({members.length})
                </h2>
                {isCurrentUserLeader && (
                  <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                    Leader
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.walletAddress.slice(2, 4)}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {formatAddress(member.walletAddress)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatNumber(member.cabalPoints)} CP
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.isCabalLeader && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                      {isCurrentUserLeader && member.id !== currentUser.id && (
                        <button
                          onClick={() => handleKickMember(member.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                          title="Kick member"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave Cabal Button */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleLeaveCabal}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave Cabal</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 