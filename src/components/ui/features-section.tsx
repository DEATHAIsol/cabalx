"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "🏆 Wallet-Based Scoring",
    description: "Earn Cabal Points in real-time based on wallet trading activity.",
    className: "md:col-span-2",
  },
  {
    title: "🛡️ Cabals",
    description: "Join gated trading groups based on your performance rank.",
    className: "md:col-span-1",
  },
  {
    title: "📊 Real-Time Dashboards",
    description: "Track PnL, win rate, and wallet analytics live.",
    className: "md:col-span-1",
  },
  {
    title: "🎯 Global Leaderboards",
    description: "Compete globally or within your Cabals to climb the ranks.",
    className: "md:col-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Everything you need to dominate Solana memecoins
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From wallet-based scoring to exclusive trading communities, CabalX provides all the tools you need to succeed in the memecoin ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 hover:border-white/20 transition-all duration-300",
                feature.className
              )}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 