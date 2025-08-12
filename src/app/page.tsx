"use client";
import { Hero, HeroTitle, HeroSubtitle } from '@/components/ui/hero';
import { WalletConnect } from '@/components/ui/wallet-connect';
import { FeaturesSection } from '@/components/ui/features-section';
import { GlobeSection } from '@/components/ui/globe-section';
import { MacbookSection } from '@/components/ui/macbook-section';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen">
      <Hero>
        <HeroTitle>
          Welcome to <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            CabalX
          </span>
        </HeroTitle>
        <HeroSubtitle>
          The ultimate social trading platform for Solana memecoins. 
          Connect your wallet, earn Cabal Points, and join exclusive trading communities.
        </HeroSubtitle>
        <WalletConnect />
      </Hero>

      <FeaturesSection />
      <GlobeSection />
      <MacbookSection />
      
      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                CabalX
              </h3>
              <p className="text-gray-400 mt-2">
                The ultimate social trading platform for Solana memecoins
              </p>
            </div>
            
            <div className="flex space-x-8">
              <a 
                href="https://twitter.com/cabalx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </a>
              
              <a 
                href="https://dexscreener.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>DexScreener</span>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400">
              © 2024 CabalX. All rights reserved. Built for the Solana ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
