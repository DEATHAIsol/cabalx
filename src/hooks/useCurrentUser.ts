import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { User } from '@/types';
import { firebaseApi } from '@/lib/firebase-api';

export const useCurrentUser = () => {
  const { connected, publicKey } = useWallet();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!connected || !publicKey) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const walletAddress = publicKey.toString();
        
        // Try to get existing user
        let user = await firebaseApi.getUser(walletAddress);
        
        if (!user) {
          // Create new user if doesn't exist
          const newUser: Partial<User> = {
            id: walletAddress,
            walletAddress: walletAddress,
            username: `user_${walletAddress.slice(0, 8)}`,
            displayName: `User ${walletAddress.slice(0, 8)}`,
            cabalPoints: 0,
            totalPnL: 0,
            winRate: 0,
            totalTrades: 0,
            winningTrades: 0,
            badges: [],
            cabalId: undefined, // This will be converted to null in the API
            createdAt: new Date(),
            lastActive: new Date()
          };
          
          await firebaseApi.upsertUser(newUser);
          user = await firebaseApi.getUser(walletAddress);
        }
        
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [connected, publicKey]);

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    try {
      await firebaseApi.upsertUser({ ...currentUser, ...updates });
      const updatedUser = await firebaseApi.getUser(currentUser.walletAddress);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return {
    currentUser,
    loading,
    updateUser
  };
}; 