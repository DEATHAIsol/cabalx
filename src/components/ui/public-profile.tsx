"use client";
import { motion } from 'framer-motion';
import { User, Cabal } from '@/types';
import { formatAddress, formatNumber } from '@/lib/utils';
import { 
  User as UserIcon, 
  MessageCircle, 
  Calendar, 
  Crown,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';

interface PublicProfileProps {
  user: User;
  cabal?: Cabal;
  onMessage?: () => void;
  showWallet?: boolean;
}

export const PublicProfile = ({ user, cabal, onMessage, showWallet = false }: PublicProfileProps) => {
  const displayName = user.displayName || user.username || formatAddress(user.walletAddress);
  const username = user.username ? `@${user.username}` : formatAddress(user.walletAddress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-start space-x-6 mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-white truncate">{displayName}</h1>
            {user.isCabalLeader && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">Leader</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-400 mb-2">{username}</p>
          
          {user.bio && (
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{user.bio}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onMessage && (
              <button
                onClick={onMessage}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            )}
            
            {showWallet && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-400">Wallet:</span>
                <span className="text-sm text-white font-mono">{formatAddress(user.walletAddress)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Cabal Points</span>
          </div>
          <p className="text-xl font-bold text-white">{formatNumber(user.cabalPoints)}</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Total PnL</span>
          </div>
          <p className={`text-xl font-bold ${user.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {user.totalPnL >= 0 ? '+' : ''}${user.totalPnL.toFixed(2)}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Win Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{user.winRate}%</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Trades</span>
          </div>
          <p className="text-xl font-bold text-white">{user.totalTrades}</p>
        </div>
      </div>

      {/* Cabal Info */}
      {cabal && (
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-lg">{cabal.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{cabal.name}</h3>
                <p className="text-sm text-gray-400">{cabal.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Cabal</p>
              <p className="text-white font-semibold">{cabal.memberCount} members</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-sm font-medium text-white">{badge.name}</p>
                <p className="text-xs text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Date */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>Joined {user.createdAt.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>
    </motion.div>
  );
}; 