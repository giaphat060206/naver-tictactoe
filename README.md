# 🎮 Naver Tic Tac Toe

A sophisticated Tic Tac Toe game built with **Next.js 15**, **React 19**, and **TypeScript**, featuring advanced AI opponents, comprehensive analytics, and a beautiful modern interface.

## ✨ Features

- 🎯 **Three Game Modes**: Player vs Player, Easy AI, Hard AI
- 🤖 **Intelligent AI**: Minimax algorithm with Alpha-Beta pruning
- 📊 **Performance Analytics**: Real-time AI performance metrics
- 🏆 **Score Tracking**: Persistent score history with localStorage
- 📜 **Move History**: Complete game replay with revert functionality
- 🎨 **Visual Highlights**: Winning combinations with golden glow effects
- 📱 **Responsive Design**: Perfect on desktop and mobile
- ⚡ **Fast Performance**: Built with Next.js 15 and Turbopack

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/giaphat060206/naver-tictactoe.git
   cd naver-tictactoe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

### Build for Production

```bash
npm run build
npm run start
```

## 🎲 How to Play

### Game Modes

#### 🧑‍🤝‍🧑 Player vs Player (PvP)
- Two human players take turns
- Player X always goes first
- First to get three in a row wins!

#### 🤖 Easy AI
- Play against a beginner-level AI
- AI makes random valid moves
- Perfect for learning the game

#### 🧠 Hard AI  
- Challenge an unbeatable AI opponent
- Uses advanced **Minimax algorithm with Alpha-Beta pruning**
- AI calculates all possible future moves to play optimally
- Provides performance metrics showing positions evaluated

### Game Controls

- **🎯 Click any empty square** to make your move
- **🔄 New Game** button to reset the board
- **⚙️ Change Mode** to switch between PvP, Easy AI, and Hard AI
- **📊 View Stats** to see win/loss records and AI performance
- **📜 Move History** shows all moves with timestamps
- **↶ Click any move** in history to revert to that position

### Winning

- Get **three of your symbols in a row** (horizontal, vertical, or diagonal)
- Winning combinations are highlighted with a **golden glow effect**
- Scores are automatically tracked and saved

## 🤖 AI Difficulty Levels Explained

### Easy AI (Random Strategy)
```typescript
// Simple random move selection
const availableMoves = board
  .map((cell, index) => cell === null ? index : -1)
  .filter(index => index !== -1);
  
const randomMove = availableMoves[
  Math.floor(Math.random() * availableMoves.length)
];
```

**Characteristics:**
- Makes completely random valid moves
- No strategic thinking
- Great for beginners and casual play
- Fast execution (~1ms per move)

### Hard AI (Minimax with Alpha-Beta Pruning)

The Hard AI uses the **Minimax algorithm**, a classic game theory approach that considers all possible future game states.

#### How Minimax Works:

1. **Game Tree Generation**: Creates a tree of all possible moves and counter-moves
2. **Position Evaluation**: Scores each terminal position (+10 for AI win, -10 for player win, 0 for draw)
3. **Minimax Principle**: AI maximizes its score while assuming the player minimizes AI's score
4. **Alpha-Beta Pruning**: Eliminates branches that cannot affect the final decision

#### Algorithm Implementation:

```typescript
/**
 * Minimax algorithm with alpha-beta pruning
 * @param board - Current board state
 * @param depth - Current search depth
 * @param isMaximizing - True if AI's turn, false if player's turn
 * @param alpha - Best score AI can guarantee
 * @param beta - Best score player can guarantee
 */
private static minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  // Count positions evaluated for performance metrics
  this.incrementPositionCounter();
  
  const gameResult = TicTacToeGame.evaluateGame(board);
  
  // Terminal states (game over)
  if (gameResult.winner === 'O') return 10 - depth; // AI wins (prefer faster wins)
  if (gameResult.winner === 'X') return depth - 10; // Player wins (delay losses)
  if (gameResult.isGameOver) return 0; // Draw
  
  if (isMaximizing) {
    // AI's turn - maximize score
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = TicTacToeGame.makeMove(board, i, 'O');
        const evaluation = this.minimax(newBoard, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        
        // Alpha-beta pruning
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    // Player's turn - minimize AI's score
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = TicTacToeGame.makeMove(board, i, 'X');
        const evaluation = this.minimax(newBoard, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        
        // Alpha-beta pruning
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}
```

#### Alpha-Beta Pruning Optimization:

Alpha-Beta pruning significantly improves performance by eliminating branches that cannot influence the final decision:

- **Alpha (α)**: Best score the maximizing player (AI) can guarantee
- **Beta (β)**: Best score the minimizing player (human) can guarantee  
- **Pruning Condition**: When `β ≤ α`, remaining branches are irrelevant

**Performance Impact:**
- **Without pruning**: ~549,946 positions evaluated per move
- **With Alpha-Beta pruning**: ~18,297 positions evaluated per move
- **Improvement**: ~97% reduction in computational complexity

#### AI Characteristics:
- **Unbeatable**: Impossible to win against (best outcome is a draw)
- **Optimal Play**: Always chooses the mathematically best move
- **Performance Tracking**: Shows positions evaluated and thinking time
- **Adaptive Difficulty**: Prefers faster wins and slower losses

## 📊 Performance Metrics

The game provides detailed AI performance analytics:

### Metrics Tracked:
- **🎯 Positions Evaluated**: Number of board states analyzed
- **⏱️ Thinking Time**: Time taken to calculate the move  
- **📈 Average Performance**: Running averages across games
- **🏃 Efficiency Rating**: Moves per second calculation

### Performance Insights:
- **Easy AI**: ~1 position, <1ms (instant random selection)
- **Hard AI**: 18,000+ positions, 20-50ms (complex analysis)
- **Efficiency**: 400,000+ positions per second
- **Optimization**: Alpha-Beta pruning reduces search space by 97%

## 🏗️ Project Architecture

### Clean Architecture Structure

```
src/
├── components/          # UI Components
│   ├── App.tsx         # Main game component
│   ├── Board.tsx       # Game board component
│   ├── Square.tsx      # Individual square component
│   ├── GameStatus.tsx  # Game status display
│   ├── ScoreBoard.tsx  # Score tracking display
│   ├── PerformanceMetrics.tsx  # AI analytics
│   └── MoveHistory.tsx # Move tracking and revert
├── logic/              # Business Logic (Pure Functions)
│   ├── gameLogic.ts    # Game rules and win checking
│   ├── aiLogic.ts      # AI algorithms (Minimax)
│   └── scoreManager.ts # Score persistence
├── hooks/              # React Hooks
│   ├── useGameState.ts     # Main game state management
│   ├── useScoreTracking.ts # Score persistence
│   └── usePerformanceMetrics.ts # AI analytics
├── types/              # TypeScript Definitions
│   └── game.ts         # Game-related interfaces
└── utils/              # Utility Functions
    ├── moveHistory.ts  # Move tracking utilities
    └── constants.ts    # Game constants
```

### Key Design Principles:
- **🔄 Separation of Concerns**: Logic, UI, and state clearly separated
- **🧩 Component Modularity**: Reusable and testable components  
- **💾 State Management**: Centralized game state with React hooks
- **📝 Type Safety**: Full TypeScript coverage
- **⚡ Performance**: Optimized algorithms and React patterns

## 🛠️ Technology Stack

### Core Technologies
- **⚛️ React 19.1.0** - Latest React with concurrent features
- **▲ Next.js 15.5.4** - Full-stack React framework with Turbopack
- **📘 TypeScript 5.x** - Type-safe JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### Development Tools
- **⚡ Turbopack** - Ultra-fast bundler for development
- **🔍 ESLint 9** - Code linting and formatting
- **🏗️ PostCSS** - CSS processing

### Features & Libraries
- **💾 localStorage** - Client-side data persistence
- **🎯 Custom Hooks** - Reusable state logic
- **📊 Performance Monitoring** - Real-time AI analytics
- **📱 Responsive Design** - Mobile-first approach

## 🏆 Game Features Deep Dive

### 1. Score Tracking System
- **Persistent Storage**: Scores saved automatically to localStorage
- **Mode-Specific Stats**: Separate tracking for PvP, Easy AI, and Hard AI
- **Detailed Metrics**: Wins, losses, draws, win streaks
- **Reset Functionality**: Clear individual modes or all scores

### 2. Move History & Revert
- **Complete Game Log**: Every move tracked with timestamps
- **Coordinate Display**: Moves shown as "Player X → A1" format  
- **One-Click Revert**: Click any move to return to that game state
- **Export Capability**: Copy game history to clipboard

### 3. Visual Enhancements
- **Winning Highlights**: Golden glow effect for winning combinations
- **Smooth Animations**: CSS transitions for better UX
- **Responsive Layout**: Adapts to different screen sizes
- **Modern Design**: Clean, professional interface

### 4. Performance Analytics
- **Real-Time Metrics**: Live AI performance data
- **Historical Tracking**: Performance trends over time
- **Efficiency Ratings**: Positions evaluated per second
- **Comparative Analysis**: Easy vs Hard AI performance

## 🎯 Advanced Features

### Move History System
```typescript
interface Move {
  position: number;        // 0-8 board position
  player: Player;         // 'X' or 'O' 
  timestamp: number;      // When move was made
  moveNumber: number;     // Sequential move number
  isAI?: boolean;        // Whether move was made by AI
  boardSnapshot: Board;   // Complete board state after move
}
```

### Performance Tracking
```typescript
interface PerformanceMetrics {
  positionsEvaluated: number;    // Total positions analyzed
  thinkingTimeMs: number;        // Time to calculate move
  totalPositionsEvaluated: number; // Cumulative across games
  averageThinkingTime: number;   // Average per move
  movesPlayed: number;           // Total moves made
}
```

### Score Management
```typescript
interface ScoreData {
  wins: number;           // Games won
  losses: number;         // Games lost  
  draws: number;          // Games drawn
  currentStreak: number;  // Current win/loss streak
  bestStreak: number;     // Best win streak
  totalGames: number;     // Total games played
}
```

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Development with alternatives
yarn dev / pnpm dev / bun dev     # Alternative package managers
```

### Development Server Features
- **🔥 Hot Reload**: Instant updates on file changes
- **⚡ Turbopack**: Ultra-fast bundling and compilation
- **🐛 Source Maps**: Enhanced debugging experience
- **📱 Mobile Testing**: Responsive design testing

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Or connect your Git repository to Vercel for automatic deployments
```

### Other Platforms
- **Netlify**: `npm run build` → Deploy `dist` folder
- **Heroku**: Configure `package.json` scripts for production
- **Docker**: Containerize with Next.js production image

## 🔧 Customization

### Difficulty Adjustment
Modify AI difficulty in `src/logic/aiLogic.ts`:

```typescript
// Easy AI: Add some strategy
static makeEasyMove(board: Board): AIResult {
  // Check for immediate win
  const winMove = this.findWinningMove(board, 'O');
  if (winMove !== -1) return { position: winMove, metrics: {...} };
  
  // Check for blocking opponent win
  const blockMove = this.findWinningMove(board, 'X');
  if (blockMove !== -1) return { position: blockMove, metrics: {...} };
  
  // Otherwise random move
  return this.makeRandomMove(board);
}
```

### Visual Themes
Customize colors in `src/app/globals.css`:

```css
/* Winning highlight color */
.winning-cell {
  @apply bg-gradient-to-br from-yellow-200 to-yellow-300 
         border-yellow-400 shadow-lg ring-2 ring-yellow-400;
}

/* Player colors */
.player-x { @apply text-blue-600; }
.player-o { @apply text-red-600; }
```

### Performance Tuning
Adjust minimax depth for different difficulty:

```typescript
// Increase depth for harder AI (more computational cost)
const MAX_DEPTH = 9; // Current: analyzes full game tree
const MEDIUM_DEPTH = 5; // Alternative: limit analysis depth
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm update @types/react @types/node
```

#### Performance Issues
- **Slow AI**: Check if running in development mode (production is faster)
- **Memory Usage**: Browser localStorage limits (~5-10MB typically)
- **Mobile Performance**: Ensure hardware acceleration enabled

## 📋 Browser Support

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅  
- **Safari** 14+ ✅
- **Edge** 90+ ✅
- **Mobile Safari** 14+ ✅
- **Mobile Chrome** 90+ ✅

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Credits

- **Algorithm**: Minimax with Alpha-Beta pruning implementation
- **Design**: Modern React component architecture  
- **Performance**: Optimized with Next.js 15 and Turbopack
- **Analytics**: Custom performance tracking system

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/giaphat060206/naver-tictactoe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/giaphat060206/naver-tictactoe/discussions)
- **Email**: [Your Contact Email]

---

**Built with ❤️ for the Naver Hackathon 2025**

*Enjoy playing and may the best strategist win! 🎮*
