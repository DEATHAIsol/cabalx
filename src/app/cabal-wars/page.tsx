"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { 
  Sword, 
  Shield, 
  Trophy, 
  Users, 
  Target, 
  Zap,
  Clock,
  Star
} from 'lucide-react';

export default function CabalWarsPage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }
  }, [connected, router]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access Cabal Wars.</p>
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
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-white text-3xl">⚔️</span>
            </div>
            <h1 className="text-5xl font-bold text-white">Cabal Wars</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Epic battles between cabals for glory, honor, and massive prize pools. 
            Up to 25 cabals compete in intense trading competitions.
          </p>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold text-yellow-400">Coming Soon</h2>
          </div>
          <p className="text-lg text-yellow-200 mb-4">
            We're preparing for the ultimate cabal battle experience
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-yellow-300">
            <span>⚡ Epic Battles</span>
            <span>🏆 Prize Pools</span>
            <span>⚔️ 25 Cabals</span>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Epic Battles</h3>
            <p className="text-gray-300">
              Face off against other cabals in intense trading competitions with real-time leaderboards
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Massive Prizes</h3>
            <p className="text-gray-300">
              Compete for your share of the total prize pool distributed among the top-performing cabals
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">25 Cabals</h3>
            <p className="text-gray-300">
              Up to 25 different cabals can participate in each war, creating massive competition
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Strategic Warfare</h3>
            <p className="text-gray-300">
              Use advanced trading strategies and teamwork to outmaneuver your opponents
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Action</h3>
            <p className="text-gray-300">
              Watch battles unfold in real-time with live updates and dynamic leaderboards
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Glory & Honor</h3>
            <p className="text-gray-300">
              Earn legendary status and exclusive rewards for your cabal's achievements
            </p>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">How Cabal Wars Will Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Registration</h3>
              <p className="text-gray-300">
                Cabals register for the war and pay entry fees to join the prize pool
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Battle Phase</h3>
              <p className="text-gray-300">
                Cabals compete in intense trading competitions over a set time period
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rewards</h3>
              <p className="text-gray-300">
                Top-performing cabals receive their share of the total prize pool
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
} 