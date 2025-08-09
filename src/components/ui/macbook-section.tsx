"use client";
import { motion } from "framer-motion";
import { MacbookScroll } from "./macbook-scroll";

export function MacbookSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Experience CabalX Anywhere
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From desktop to mobile, CabalX provides a seamless trading experience across all devices. 
            Connect your wallet, track your performance, and join exclusive Cabals from anywhere in the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <MacbookScroll
            src="/placeholder.png"
            title="Experience CabalX on any device. Seamless trading, anywhere."
            showGradient={true}
            badge={
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                🚀 Live Demo
              </div>
            }
          />
        </motion.div>
      </div>
    </section>
  );
} 