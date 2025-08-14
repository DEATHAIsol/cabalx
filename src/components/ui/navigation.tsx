"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Home, 
  Users, 
  Trophy, 
  User,
  Crown,
  LogOut,
  MessageCircle,
  Sword
} from 'lucide-react';
import { NotificationBell, Notification } from './notification';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Chat', path: '/chat', icon: MessageCircle },
  { name: 'Cabals', path: '/cabal', icon: Users },
  { name: 'Cabal Wars', path: '/cabal-wars', icon: Sword },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Profile', path: '/profile', icon: User },
];

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'trade',
    title: 'New Trade Alert',
    message: 'Someone in Degen Masters just bought 1M BONK!',
    timestamp: new Date(Date.now() - 300000),
    read: false
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message in Degen Masters cabal',
    timestamp: new Date(Date.now() - 600000),
    read: false
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Profit Hunter" badge!',
    timestamp: new Date(Date.now() - 900000),
    read: true
  }
];

export const Navigation = () => {
  const { connected, disconnect } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleClearAll = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  if (!connected) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Crown className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">CabalX</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Wallet and User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
              
              <WalletMultiButton className="!bg-purple-600 !text-white !font-semibold !px-4 !py-2 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-200" />
              
              <button
                onClick={handleDisconnect}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}; 