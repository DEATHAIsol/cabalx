"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Send, Search, Users, MessageCircle, Globe, Crown } from 'lucide-react';
import { User, Conversation, Message } from '@/types';
import { firebaseApi } from '@/lib/firebase-api';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Navigation } from '@/components/ui/navigation';

function ChatPageContent() {
  // Wallet and user state
  const { connected, publicKey } = useWallet();
  const { currentUser } = useCurrentUser();
  const searchParams = useSearchParams();

  // Add chat-page class to body
  useEffect(() => {
    document.body.classList.add('chat-page');
    return () => {
      document.body.classList.remove('chat-page');
    };
  }, []);

  // State
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [conversationParticipants, setConversationParticipants] = useState<Record<string, User[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation ID from URL params
  const conversationId = searchParams.get('c');

  // Load conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      if (!currentUser) return;
      
      const conversationsData = await firebaseApi.getUserRooms(currentUser.id);
      
      // Sort conversations: world first, then cabal, then DMs
      const finalConversations = conversationsData.sort((a, b) => {
        if (a.type === 'world') return -1;
        if (b.type === 'world') return 1;
        if (a.type === 'cabal') return -1;
        if (b.type === 'cabal') return 1;
        return 0;
      });
      
      // Ensure world chat exists (fallback)
      const hasWorldChat = finalConversations.some(c => c.type === 'world');
      if (!hasWorldChat) {
        const defaultWorldChat: Conversation = {
          id: 'world',
          type: 'world',
          cabalId: undefined,
          createdAt: new Date()
        };
        finalConversations.unshift(defaultWorldChat);
      }
      
      // Load additional details for conversations
      const conversationsWithDetails = await Promise.all(
        finalConversations.map(async (conversation) => {
          if (conversation.type === 'cabal' && conversation.cabalId) {
            try {
              const cabal = await firebaseApi.getCabal(conversation.cabalId);
              if (cabal) {
                return {
                  ...conversation,
                  cabalName: cabal.name,
                  cabalIcon: cabal.icon
                };
              }
            } catch (error) {
              console.error('Error loading cabal details:', error);
            }
          } else if (conversation.type === 'dm') {
            try {
              // Get the other participant in the DM
              const participants = await firebaseApi.getRoomParticipants(conversation.id);
              const otherParticipant = participants.find(p => p.id !== currentUser.id);
              if (otherParticipant) {
                return {
                  ...conversation,
                  dmParticipant: otherParticipant
                };
              }
            } catch (error) {
              console.error('Error loading DM participant details:', error);
            }
          }
          return conversation;
        })
      );
      
      // Update state only if conversations have actually changed
      setConversations(prev => {
        const prevIds = prev.map(c => c.id).sort();
        const newIds = conversationsWithDetails.map(c => c.id).sort();
        
        if (JSON.stringify(prevIds) === JSON.stringify(newIds)) {
          return prev; // No change, keep existing state
        }
        return conversationsWithDetails;
      });
      
      // Select conversation from URL or default to world
      if (conversationId) {
        const conversation = conversationsWithDetails.find(c => c.id === conversationId);
        if (conversation) {
          setSelectedConversation(conversation);
        }
      } else if (conversationsWithDetails.length > 0) {
        // Default to world chat
        const worldChat = conversationsWithDetails.find(c => c.type === 'world');
        if (worldChat) {
          setSelectedConversation(worldChat);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const messagesData = await firebaseApi.getMessages(conversationId);
      
      // Update messages state only if there are actual changes
      setMessages(prev => {
        const prevIds = prev.map(m => m.id).sort();
        const newIds = messagesData.map(m => m.id).sort();
        
        if (JSON.stringify(prevIds) === JSON.stringify(newIds)) {
          return prev; // No change, keep existing state
        }
        return messagesData;
      });
      
      // Auto-scroll to bottom after messages load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = firebaseApi.subscribeToMessages(selectedConversation.id, (newMessages) => {
      setMessages(newMessages);
      
      // Auto-scroll to bottom for new messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    const messageToSend = messageText.trim();
    setMessageText('');

    try {
      // Create optimistic message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        body: messageToSend,
        sender: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName
        },
        createdAt: new Date(),
        softDeleted: false
      };

      // Add optimistic message to UI
      setMessages(prev => [...prev, tempMessage]);

      // Send message to Firebase
      await firebaseApi.sendMessage(selectedConversation.id, { body: messageToSend }, currentUser);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== `temp-${Date.now()}`));
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    console.log('searchUsers called with query:', query);
    if (!query || query.length < 2) {
      // If no query, load all users for browsing
      try {
        console.log('Loading all users...');
        const allUsers = await firebaseApi.getAllUsers();
        console.log('All users loaded:', allUsers.length);
        setUserSearchResults(allUsers.filter((user: User) => user.id !== currentUser?.id));
      } catch (error) {
        console.error('Error loading all users:', error);
        setUserSearchResults([]);
      }
      return;
    }

    try {
      console.log('Searching users with query:', query);
      const results = await firebaseApi.searchUsers(query);
      console.log('Search results:', results.length);
      setUserSearchResults(results.filter(user => user.id !== currentUser?.id));
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
    }
  };

  // Start DM
  const startDM = async (user: User) => {
    if (!currentUser) return;

    try {
      // Don't allow DM with self
      if (user.id === currentUser.id) {
        console.error('Cannot start DM with yourself');
        return;
      }

      console.log('Starting DM with user:', user);
      const roomId = await firebaseApi.startDM(currentUser.id, user.id);
      
      // Create conversation object
      const conversation: Conversation = {
        id: roomId,
        type: 'dm',
        cabalId: undefined,
        createdAt: new Date()
      };

      // Add to conversations list
      setConversations(prev => {
        const exists = prev.some(c => c.id === roomId);
        if (!exists) {
          return [...prev, conversation];
        }
        return prev;
      });

      // Select the new conversation
      setSelectedConversation(conversation);
      setShowUserSearch(false);
      setSearchTerm('');
      setUserSearchResults([]);
    } catch (error) {
      console.error('Error starting DM:', error);
    }
  };

  // Start group DM
  const startGroupDM = async () => {
    if (selectedUsers.length === 0 || !currentUser) return;

    try {
      // For now, just start a DM with the first selected user
      // TODO: Implement proper group DM functionality
      await startDM(selectedUsers[0]);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error starting group DM:', error);
    }
  };

  // Toggle user selection for group DM
  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Load conversations on mount and when user changes
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Load users when user search is shown
  useEffect(() => {
    if (showUserSearch && userSearchResults.length === 0 && currentUser) {
      searchUsers('');
    }
  }, [showUserSearch, currentUser]);

  // Search users when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 0) {
        searchUsers(searchTerm);
      } else if (showUserSearch && userSearchResults.length === 0) {
        // Load all users when search is empty and user list is shown but empty
        searchUsers('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, showUserSearch]);

  // Handle Enter key in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get conversation icon
  const getConversationIcon = (type: string, cabalIcon?: string) => {
    switch (type) {
      case 'world':
        return <Globe className="w-5 h-5" />;
      case 'cabal':
        return <span className="text-lg">{cabalIcon || '🏛️'}</span>;
      case 'dm':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  // Get conversation color
  const getConversationColor = (type: string) => {
    switch (type) {
      case 'world':
        return 'bg-blue-500';
      case 'cabal':
        return 'bg-purple-500';
      case 'dm':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get conversation name
  const getConversationName = (conversation: Conversation & { cabalName?: string; cabalIcon?: string; dmParticipant?: User }) => {
    switch (conversation.type) {
      case 'world':
        return 'World Chat';
      case 'cabal':
        return conversation.cabalName || 'Cabal Chat';
      case 'dm':
        return conversation.dmParticipant?.username || conversation.dmParticipant?.displayName || 'Direct Message';
      default:
        return 'Unknown';
    }
  };

  // Get conversation description
  const getConversationDescription = (conversation: Conversation & { cabalName?: string; cabalIcon?: string; dmParticipant?: User }) => {
    switch (conversation.type) {
      case 'world':
        return 'Global trading community';
      case 'cabal':
        return `Private cabal: ${conversation.cabalName || 'Loading...'}`;
      case 'dm':
        return `Private conversation with ${conversation.dmParticipant?.username || conversation.dmParticipant?.displayName || 'Unknown'}`;
      default:
        return '';
    }
  };

  if (!connected || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 pt-16">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Chat</h1>
        </div>

        {/* Search and User Results */}
        <div className="border-b border-gray-700">
          {/* Search Bar - Always Visible */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users to message..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length > 0) {
                    setShowUserSearch(true);
                  }
                }}
                onFocus={() => {
                  if (searchTerm.length > 0 || userSearchResults.length > 0) {
                    setShowUserSearch(true);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Quick Actions */}
            {searchTerm.length === 0 && !showUserSearch && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => {
                    console.log('Browse Users clicked');
                    setShowUserSearch(true);
                    searchUsers('');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-sm rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Browse Users</span>
                </button>
                <button
                  onClick={() => {
                    console.log('New DM clicked');
                    setShowUserSearch(true);
                    searchUsers('');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>New DM</span>
                </button>
              </div>
            )}
          </div>

          {/* User Search Results */}
          {showUserSearch && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">
                  {searchTerm.length > 0 ? 'Search Results' : 'All Users'}
                </h3>
                <button
                  onClick={() => {
                    console.log('Close search clicked');
                    setShowUserSearch(false);
                    setSearchTerm('');
                    setUserSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              
              {searchTerm.length === 0 && userSearchResults.length === 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => {
                      console.log('Load all users clicked');
                      searchUsers('');
                    }}
                    className="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                  >
                    Click to load all users...
                  </button>
                </div>
              )}
              
              {userSearchResults.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userSearchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => startDM(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.username?.charAt(0).toUpperCase() || user.displayName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {user.username || user.displayName || 'Unknown'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </p>
                          {user.cabalPoints > 0 && (
                            <p className="text-purple-400 text-xs">
                              {user.cabalPoints} CP
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.cabalId && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                            Cabal
                          </span>
                        )}
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm.length > 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No users found</p>
                  <p className="text-gray-500 text-xs">Try a different search term</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getConversationColor(conversation.type)}`}>
                      {getConversationIcon(conversation.type, conversation.cabalIcon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{getConversationName(conversation)}</h3>
                      <p className="text-sm opacity-75 truncate">{getConversationDescription(conversation)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getConversationColor(selectedConversation.type)}`}>
                  {getConversationIcon(selectedConversation.type, selectedConversation.cabalIcon)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{getConversationName(selectedConversation)}</h2>
                  <p className="text-sm text-gray-400">{getConversationDescription(selectedConversation)}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.senderId === currentUser.id;
                  return (
                    <motion.div
                      key={`${message.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-purple-600 text-white rounded-l-lg rounded-tr-lg' 
                          : 'bg-gray-700 text-white rounded-r-lg rounded-tl-lg'
                      }`}>
                        <div className={`text-xs opacity-75 mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {message.sender?.username || `User_${message.senderId.slice(0, 8)}`}
                        </div>
                        <p className="text-sm break-words">{message.body}</p>
                        <div className={`text-xs opacity-50 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!selectedConversation}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || !selectedConversation}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Select a Conversation</h2>
              <p className="text-gray-400">Choose a conversation from the sidebar to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <ChatPageContent />
      </Suspense>
    </>
  );
}