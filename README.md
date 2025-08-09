# CabalX - Social Trading Platform for Solana Memecoins

A full-stack web application for social trading on Solana, featuring exclusive trading communities (Cabals), real-time performance tracking, and gamified trading experiences.

## 🚀 Features

### ✅ Completed Features
- **Wallet Connect**: Seamless Solana wallet integration with Phantom and Solflare support
- **Score Dashboard**: Real-time display of Cabal Points (CP), trading stats, and performance metrics
- **Cabal System**: Create and join exclusive trading communities with CP requirements
- **Global Leaderboard**: Rank users and cabals by performance and CP
- **User Profiles**: Detailed profiles showing badges, stats, and joined cabals
- **Modern UI**: Beautiful Aceternity UI-inspired design with smooth animations

### 🎯 Core Features
1. **Wallet Integration**: Connect Solana wallets and track on-chain performance
2. **Cabal Points (CP)**: Gamified scoring system based on trading performance
3. **Exclusive Communities**: Join cabals with minimum CP requirements
4. **Real-time Stats**: Live tracking of PnL, win rates, and trading metrics
5. **Badge System**: Achievement system with different rarity levels
6. **Leaderboards**: Global rankings for traders and cabals

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS with custom Aceternity UI components
- **Wallet**: Solana Wallet Adapter
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Blockchain**: Solana (Devnet)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cabalx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" on the landing page
2. **View Dashboard**: After connection, you'll be redirected to your dashboard
3. **Explore Cabals**: Browse and join exclusive trading communities
4. **Check Leaderboards**: See how you rank against other traders
5. **View Profile**: Check your badges, stats, and achievements

### Features Walkthrough

#### Dashboard
- View your Cabal Points and trading performance
- See your badges and achievements
- Quick access to cabals, leaderboards, and profile
- Recent activity feed

#### Cabals
- Browse available cabals with CP requirements
- Create your own cabal with custom settings
- Join cabals if you meet the minimum CP threshold
- View cabal statistics and member counts

#### Leaderboard
- Global rankings for traders and cabals
- Filter by different metrics
- View detailed performance statistics

#### Profile
- Comprehensive trading statistics
- Badge collection and achievements
- Joined cabals overview
- Trading history and activity

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── cabal/            # Cabal management
│   ├── leaderboard/      # Global rankings
│   ├── profile/          # User profiles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── hero.tsx     # Hero section components
│   │   ├── stats-card.tsx # Stats display cards
│   │   ├── badge.tsx    # Badge components
│   │   ├── modal.tsx    # Modal dialogs
│   │   ├── navigation.tsx # Navigation bar
│   │   └── wallet-connect.tsx # Wallet connection
│   └── providers/       # Context providers
│       └── wallet-provider.tsx # Solana wallet provider
├── lib/                 # Utility functions
│   ├── utils.ts         # Common utilities
│   └── solana.ts        # Solana configuration
└── types/               # TypeScript type definitions
    └── index.ts         # Application types
```

## 🎨 Design System

The application uses a custom design system inspired by Aceternity UI with:

- **Color Palette**: Purple and blue gradients with dark backgrounds
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Smooth Framer Motion transitions
- **Components**: Reusable, accessible UI components
- **Responsive**: Mobile-first design approach

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Wallet Configuration
The app supports:
- Phantom Wallet
- Solflare Wallet
- Other Solana wallet adapters

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Cabal chat rooms with WebSocket integration
- **Trade Feed**: Real-time trading activity from cabal members
- **Quest System**: Daily and weekly challenges for CP rewards
- **Advanced Analytics**: Detailed trading performance insights
- **Mobile App**: React Native mobile application
- **Backend Integration**: Full backend with MongoDB and real-time data

### Technical Improvements
- **Real-time Data**: WebSocket connections for live updates
- **Database**: MongoDB integration for persistent data
- **Authentication**: Enhanced wallet-based authentication
- **API Integration**: Solana Tracker API, Helius, Jupiter integration
- **Performance**: Optimized loading and caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Aceternity UI](https://ui.aceternity.com/) for design inspiration
- [Solana Labs](https://solana.com/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, email support@cabalx.com or join our Discord community.

---

**CabalX** - Where elite traders unite! 🚀👑
