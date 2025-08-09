"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { formatTimeAgo } from '@/lib/utils';
import { User, Message, ChatRoom } from '@/types';
import { 
  Search, 
  MessageCircle, 
  Users, 
  Globe,
  Send,
  MoreVertical,
  ArrowLeft,
  Image as ImageIcon,
  Smile
} from 'lucide-react';

// Mock data for chat
const mockCurrentUser: User = {
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
  badges: [],
  cabalId: '1',
  isCabalLeader: true,
  dmPrefs: { allowFrom: 'everyone' },
  createdAt: new Date('2024-01-01'),
  lastActive: new Date()
};

const mockChatRooms: ChatRoom[] = [
  {
    id: 'world',
    type: 'world',
    name: 'World Chat',
    description: 'Global chat for all CabalX members',
    participants: [],
    unreadCount: 0,
    isPinned: true,
    isOnline: true
  },
  {
    id: 'cabal-1',
    type: 'cabal',
    name: 'Degen Masters',
    description: 'Elite traders who hunt the biggest gains',
    participants: [],
    unreadCount: 3,
    isPinned: true,
    isOnline: true
  },
  {
    id: 'dm-1',
    type: 'dm',
    name: 'Solana Sage',
    description: 'Direct message',
    participants: [mockCurrentUser],
    unreadCount: 0,
    isPinned: false,
    isOnline: true
  },
  {
    id: 'dm-2',
    type: 'dm',
    name: 'Meme Lord',
    description: 'Direct message',
    participants: [mockCurrentUser],
    unreadCount: 1,
    isPinned: false,
    isOnline: false
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'world',
    roomKey: 'world',
    fromUserId: '2',
    text: 'Welcome to CabalX World Chat! 🌍',
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'world',
    roomKey: 'world',
    fromUserId: '3',
    text: 'Anyone trading $BONK today?',
    createdAt: new Date(Date.now() - 3000000)
  },
  {
    id: '3',
    type: 'world',
    roomKey: 'world',
    fromUserId: '1',
    text: 'Just made a nice profit on $WIF! 🚀',
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    id: '4',
    type: 'world',
    roomKey: 'world',
    fromUserId: '4',
    text: 'What do you think about $POPCAT?',
    createdAt: new Date(Date.now() - 900000)
  }
];

export default function ChatPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    setChatRooms(mockChatRooms);
    setCurrentRoom(mockChatRooms[0]); // Start with World Chat
    setMessages(mockMessages);
    setCurrentUser(mockCurrentUser);
  }, [connected, router]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentRoom) return;

    const message: Message = {
      id: Date.now().toString(),
      type: currentRoom.type,
      roomKey: currentRoom.id,
      fromUserId: currentUser?.id || '1',
      text: newMessage.trim(),
      createdAt: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleRoomSelect = (room: ChatRoom) => {
    setCurrentRoom(room);
    setShowUserInfo(false);
    // In a real app, you'd fetch messages for this room
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedRooms = filteredRooms.filter(room => room.isPinned);
  const unpinnedRooms = filteredRooms.filter(room => !room.isPinned);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'world':
        return <Globe className="w-5 h-5" />;
      case 'cabal':
        return <Users className="w-5 h-5" />;
      case 'dm':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getRoomColor = (type: string) => {
    switch (type) {
      case 'world':
        return 'text-blue-400';
      case 'cabal':
        return 'text-purple-400';
      case 'dm':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!connected || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navigation />
      <div className="pt-16 h-screen flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/10 backdrop-blur-sm border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Chat Rooms */}
          <div className="flex-1 overflow-y-auto">
            {/* Pinned Rooms */}
            {pinnedRooms.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-2">Pinned</div>
                {pinnedRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                      currentRoom?.id === room.id
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${getRoomColor(room.type)}`}>
                        {getRoomIcon(room.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{room.name}</h3>
                          {room.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-75 truncate">{room.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Unpinned Rooms */}
            {unpinnedRooms.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-2">Recent</div>
                {unpinnedRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                      currentRoom?.id === room.id
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${getRoomColor(room.type)}`}>
                        {getRoomIcon(room.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{room.name}</h3>
                          {room.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-75 truncate">{room.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${getRoomColor(currentRoom.type)}`}>
                      {getRoomIcon(currentRoom.type)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{currentRoom.name}</h2>
                      <p className="text-sm text-gray-400">{currentRoom.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowUserInfo(!showUserInfo)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.fromUserId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.fromUserId === currentUser.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.fromUserId === currentUser.id ? 'You' : 'User'}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatTimeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* User Info Panel */}
        <AnimatePresence>
          {showUserInfo && currentRoom && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="w-80 bg-white/10 backdrop-blur-sm border-l border-white/20 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Chat Info</h3>
                <button
                  onClick={() => setShowUserInfo(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto mb-3">
                    <div className={`${getRoomColor(currentRoom.type)}`}>
                      {getRoomIcon(currentRoom.type)}
                    </div>
                  </div>
                  <h4 className="text-white font-semibold">{currentRoom.name}</h4>
                  <p className="text-sm text-gray-400">{currentRoom.description}</p>
                </div>

                {currentRoom.type === 'cabal' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Members</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Total CP</span>
                      <span className="text-purple-400 font-semibold">15,420</span>
                    </div>
                  </div>
                )}

                {currentRoom.type === 'dm' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Status</span>
                      <span className={`text-sm ${currentRoom.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                        {currentRoom.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Last seen</span>
                      <span className="text-white text-sm">2 hours ago</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <button className="w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    Report Chat
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 