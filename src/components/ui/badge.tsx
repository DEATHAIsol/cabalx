"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon?: string;
  className?: string;
}

const rarityColors = {
  common: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const rarityIcons = {
  common: '🥉',
  rare: '🥈',
  epic: '🥇',
  legendary: '👑',
};

export const Badge = ({ name, description, rarity, icon, className }: BadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border backdrop-blur-sm transition-all duration-200",
        rarityColors[rarity],
        className
      )}
    >
      <div className="text-2xl">
        {icon || rarityIcons[rarity]}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs opacity-80">{description}</p>
      </div>
    </motion.div>
  );
}; 