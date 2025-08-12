// Enhanced interfaces for messaging privacy and access control

export interface User {
  id: string
  walletAddress: string
  username?: string
  displayName?: string
  bio?: string
  profileImageUrl?: string
  cabalPoints: number
  totalPnL: number
  winRate: number
  totalTrades: number
  winningTrades: number
  badges: Badge[]
  cabalId?: string
  isCabalLeader?: boolean
  dmPrefs?: {
    allowFrom: 'everyone' | 'cabal' | 'nobody'
  }
  createdAt: Date
  lastActive: Date
}

export interface Cabal {
  id: string
  name: string
  description: string
  minCabalPoints: number
  icon: string
  leaderWallet: string
  leaderUserId?: string
  memberCount: number
  totalCabalPoints: number
  isFull: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CabalMember {
  cabalId: string
  userId: string
  joinedAt: Date
}

export interface Conversation {
  id: string
  type: 'dm' | 'cabal' | 'world'
  cabalId?: string
  createdAt: Date
  cabalName?: string
  cabalIcon?: string
  dmParticipant?: User
}

export interface ConversationParticipant {
  conversationId: string
  userId: string
  joinedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  cabalId?: string
  senderId: string
  body: string
  createdAt: Date
  softDeleted: boolean
  sender?: {
    id: string
    username?: string
    displayName?: string
    profileImageUrl?: string
  }
}

// Legacy interfaces for backward compatibility
export interface Trade {
  id: string
  userId: string
  tokenSymbol: string
  tokenAddress: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  pnl: number
  timestamp: Date
  cabalId?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly'
  reward: number
  progress: number
  maxProgress: number
  completed: boolean
}

export interface ChatMessage {
  id: string
  cabalId: string
  senderWallet: string
  senderName: string
  message: string
  timestamp: Date
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  data?: Record<string, unknown>
  timestamp: Date
  read: boolean
}

// New interfaces for enhanced messaging
export interface ChatRoom {
  id: string
  type: 'dm' | 'cabal' | 'world'
  name: string
  description?: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isOnline?: boolean
  isPrivate?: boolean
  accessLevel?: 'public' | 'cabal' | 'private'
}

// API response types
export interface StartDMResponse {
  conversation: Conversation
  success: boolean
  error?: string
}

export interface CabalRoomResponse {
  conversationId: string
  success: boolean
  error?: string
}

export interface PostMessageResponse {
  message: Message
  success: boolean
  error?: string
}

// Real-time channel types
export interface RealtimeChannel {
  id: string
  type: 'dm' | 'cabal' | 'world'
  name: string
  accessLevel: 'public' | 'cabal' | 'private'
}

// Task and Reward interfaces (keeping for backward compatibility)
export interface Task {
  id: string
  title: string
  description: string
  cpReward: number
  type: 'twitter_follow' | 'twitter_retweet' | 'discord_join' | 'daily_login' | 'referral' | 'custom'
  externalUrl?: string
  status: 'active' | 'inactive'
  isOneTime: boolean
  icon: string
  completed?: boolean
  completedAt?: Date
  cpAwarded?: number
}

export interface UserTaskProgress {
  id: string
  userId: string
  taskId: string
  completed: boolean
  completedAt?: Date
  cpAwarded: number
  task?: Task
}

export interface Reward {
  id: string
  cabalId: string
  cabalName: string
  totalCP: number
  rank: number
  tokenAmount: number
  distributionPeriod: string
  distributedAt: Date
  status: 'pending' | 'distributed' | 'failed'
}

export interface CabalRewardInfo {
  id: string
  name: string
  totalCP: number
  memberCount: number
  rank: number
}

export interface RewardLeaderboardEntry {
  rank: number
  cabalId: string
  name: string
  totalCP: number
  memberCount: number
  estimatedReward: number
  lastReward?: number
} 