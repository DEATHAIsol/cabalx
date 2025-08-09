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
  members: string[]
  totalCabalPoints: number
  leader: string
  memberCount: number
  isFull: boolean
  createdAt: Date
  createdBy: string
}

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

// New interfaces for the messaging system
export interface Message {
  id: string
  type: 'dm' | 'cabal' | 'world'
  roomKey: string
  fromUserId: string
  toUserId?: string
  cabalId?: string
  text: string
  attachmentUrl?: string
  createdAt: Date
  softDeleted?: boolean
}

export interface Conversation {
  id: string
  roomKey: string
  type: 'dm' | 'cabal' | 'world'
  participants: string[]
  lastMessageAt: Date
  lastMessageText?: string
  lastMessageFrom?: string
  unreadBy: Array<{
    userId: string
    count: number
  }>
  pinnedBy: string[]
  createdAt: Date
}

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
}

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