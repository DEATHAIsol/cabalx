"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GlobeConfig } from "./globe";

// Dynamically import the World component to avoid SSR issues
const World = dynamic(() => import("./globe").then(mod => ({ default: mod.World })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white text-lg">Loading globe...</div>
    </div>
  )
});

// Enhanced data for trading connections around the world
const globeData = [
  // North America connections
  {
    order: 1,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 51.5074,
    endLng: -0.1278, // London
    arcAlt: 0.3,
    color: "#8B5CF6",
  },
  {
    order: 2,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 35.6762,
    endLng: 139.6503, // Tokyo
    arcAlt: 0.4,
    color: "#EC4899",
  },
  {
    order: 3,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.5,
    color: "#3B82F6",
  },
  {
    order: 4,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 55.7558,
    endLng: 37.6176, // Moscow
    arcAlt: 0.3,
    color: "#10B981",
  },
  {
    order: 5,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 22.3193,
    endLng: 114.1694, // Hong Kong
    arcAlt: 0.4,
    color: "#F59E0B",
  },
  // London connections
  {
    order: 6,
    startLat: 51.5074,
    startLng: -0.1278, // London
    endLat: 35.6762,
    endLng: 139.6503, // Tokyo
    arcAlt: 0.3,
    color: "#EF4444",
  },
  {
    order: 7,
    startLat: 51.5074,
    startLng: -0.1278, // London
    endLat: 55.7558,
    endLng: 37.6176, // Moscow
    arcAlt: 0.2,
    color: "#8B5CF6",
  },
  {
    order: 8,
    startLat: 51.5074,
    startLng: -0.1278, // London
    endLat: 22.3193,
    endLng: 114.1694, // Hong Kong
    arcAlt: 0.4,
    color: "#EC4899",
  },
  {
    order: 9,
    startLat: 51.5074,
    startLng: -0.1278, // London
    endLat: 19.0760,
    endLng: 72.8777, // Mumbai
    arcAlt: 0.3,
    color: "#3B82F6",
  },
  // Tokyo connections
  {
    order: 10,
    startLat: 35.6762,
    startLng: 139.6503, // Tokyo
    endLat: 22.3193,
    endLng: 114.1694, // Hong Kong
    arcAlt: 0.2,
    color: "#10B981",
  },
  {
    order: 11,
    startLat: 35.6762,
    startLng: 139.6503, // Tokyo
    endLat: 19.0760,
    endLng: 72.8777, // Mumbai
    arcAlt: 0.3,
    color: "#F59E0B",
  },
  {
    order: 12,
    startLat: 35.6762,
    startLng: 139.6503, // Tokyo
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.4,
    color: "#EF4444",
  },
  // Hong Kong connections
  {
    order: 13,
    startLat: 22.3193,
    startLng: 114.1694, // Hong Kong
    endLat: 19.0760,
    endLng: 72.8777, // Mumbai
    arcAlt: 0.2,
    color: "#8B5CF6",
  },
  {
    order: 14,
    startLat: 22.3193,
    startLng: 114.1694, // Hong Kong
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.3,
    color: "#EC4899",
  },
  // Mumbai connections
  {
    order: 15,
    startLat: 19.0760,
    startLng: 72.8777, // Mumbai
    endLat: 55.7558,
    endLng: 37.6176, // Moscow
    arcAlt: 0.2,
    color: "#3B82F6",
  },
  {
    order: 16,
    startLat: 19.0760,
    startLng: 72.8777, // Mumbai
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.4,
    color: "#10B981",
  },
  // Moscow connections
  {
    order: 17,
    startLat: 55.7558,
    startLng: 37.6176, // Moscow
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.5,
    color: "#F59E0B",
  },
  // Additional major cities
  {
    order: 18,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 48.8566,
    endLng: 2.3522, // Paris
    arcAlt: 0.3,
    color: "#EF4444",
  },
  {
    order: 19,
    startLat: 51.5074,
    startLng: -0.1278, // London
    endLat: 48.8566,
    endLng: 2.3522, // Paris
    arcAlt: 0.1,
    color: "#8B5CF6",
  },
  {
    order: 20,
    startLat: 40.7128,
    startLng: -74.0060, // New York
    endLat: 23.6345,
    endLng: -102.5528, // Mexico City
    arcAlt: 0.2,
    color: "#EC4899",
  },
  {
    order: 21,
    startLat: 35.6762,
    startLng: 139.6503, // Tokyo
    endLat: 37.5665,
    endLng: 126.9780, // Seoul
    arcAlt: 0.1,
    color: "#3B82F6",
  },
  {
    order: 22,
    startLat: 22.3193,
    startLng: 114.1694, // Hong Kong
    endLat: 1.3521,
    endLng: 103.8198, // Singapore
    arcAlt: 0.1,
    color: "#10B981",
  },
  {
    order: 23,
    startLat: 19.0760,
    startLng: 72.8777, // Mumbai
    endLat: 28.6139,
    endLng: 77.2090, // New Delhi
    arcAlt: 0.1,
    color: "#F59E0B",
  },
  {
    order: 24,
    startLat: 55.7558,
    startLng: 37.6176, // Moscow
    endLat: 59.3293,
    endLng: 18.0686, // Stockholm
    arcAlt: 0.2,
    color: "#EF4444",
  },
];

const globeConfig: GlobeConfig = {
  globeColor: "#1d072e",
  atmosphereColor: "#8B5CF6",
  showAtmosphere: true,
  atmosphereAltitude: 0.15,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(139, 92, 246, 0.3)",
  ambientLight: "#8B5CF6",
  directionalLeftLight: "#EC4899",
  directionalTopLight: "#3B82F6",
  pointLight: "#10B981",
  arcTime: 3000, // Slower animation for better performance
  arcLength: 0.8, // Shorter arcs
  rings: 1,
  maxRings: 2, // Reduced max rings
  autoRotate: true,
  autoRotateSpeed: 0.3, // Slower rotation
};

export function GlobeSection() {
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
            Connected to the Globe at Large
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join traders from around the world in real-time. Every arc represents a connection, 
            every point a trader, and every ring a new opportunity in the global memecoin ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/10">
            <World globeConfig={globeConfig} data={globeData} />
          </div>
          
          {/* Overlay with stats */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="text-white">10,000+ Global Traders</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="text-white">200+ Countries</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-white">24+ Trading Hubs</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white">24/7 Trading</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 max-w-2xl mx-auto">
            The globe above shows real-time connections between CabalX traders worldwide. 
            Each animated arc represents active trading relationships and knowledge sharing across borders.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 