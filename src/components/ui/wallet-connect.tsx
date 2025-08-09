"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const WalletConnect = ({ className }: { className?: string }) => {
  const { connected, wallet } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className={cn("flex flex-col items-center space-y-4", className)}
    >
      <div className="relative">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !text-white !font-semibold !px-8 !py-4 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-200" />
      </div>
      
      {connected && wallet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-green-500 font-medium">
            ✅ Connected with {wallet.adapter.name}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}; 