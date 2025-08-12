import { supabase } from './supabase';
import { useWallet } from '@solana/wallet-adapter-react';

// Wallet-based authentication for Supabase
export const authenticateWithWallet = async (walletAddress: string) => {
  try {
    // Create a custom JWT token for the wallet address
    // This is a simplified approach - in production you'd want proper JWT signing
    const token = btoa(JSON.stringify({
      wallet_address: walletAddress,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    }));

    // Set the auth token
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token
    });

    if (error) {
      console.error('Authentication error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

// Hook for wallet-based authentication
export const useSupabaseAuth = () => {
  const { connected, publicKey } = useWallet();

  const authenticate = async () => {
    if (!connected || !publicKey) {
      return false;
    }

    const walletAddress = publicKey.toString();
    return await authenticateWithWallet(walletAddress);
  };

  return { authenticate, connected, publicKey };
};

// Alternative approach: Use RLS policies that don't require auth
export const createUnauthenticatedClient = () => {
  // Create a client that bypasses auth for read operations
  return supabase;
}; 