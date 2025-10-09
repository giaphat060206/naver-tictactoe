# Clean Architecture Documentation

## Project Structure

```
src/
├── components/           # UI Components (React Components)
│   ├── TicTacToe.tsx    # Main orchestrator component
│   ├── GameBoard.tsx    # Game board grid component
│   ├── GameModeSelect.tsx # Game mode selection component
│   ├── GameStatus.tsx   # Status display component
│   └── GameInstructions.tsx # Instructions component
├── hooks/               # React Hooks
│   └── useGameState.ts  # Game state management hook
├── logic/               # Business Logic (Framework Independent)
│   ├── gameLogic.ts     # Core game mechanics
│   └── aiLogic.ts       # AI algorithms (Minimax, Alpha-Beta)
├── types/               # TypeScript Type Definitions
│   └── game.ts          # Game-related types and interfaces
├── utils/               # Utilities and Constants
│   └── constants.ts     # Game constants and messages
└── index.ts             # Barrel exports
```

## Architecture Principles

### 1. Separation of Concerns
- **UI Components**: Pure presentation logic, no business rules
- **Hooks**: State management and side effects
- **Logic Modules**: Pure business logic, framework-independent
- **Types**: Centralized type definitions

### 2. Clean Architecture Layers

#### Presentation Layer (Components)
- `TicTacToe.tsx`: Main component that orchestrates the UI
- `GameBoard.tsx`: Renders the 3x3 grid
- `GameModeSelect.tsx`: Handles game mode selection
- `GameStatus.tsx`: Displays current game status
- `GameInstructions.tsx`: Shows instructions based on mode

#### Application Layer (Hooks)
- `useGameState.ts`: Custom hook managing game state and actions
- Uses `useCallback` for memoized functions
- Uses `useEffect` for side effects (AI delays)
- Provides clean interface to UI components

#### Domain Layer (Logic)
- `gameLogic.ts`: Core game rules and mechanics
  - Board validation
  - Win condition checking
  - Move validation
  - Game state evaluation
- `aiLogic.ts`: AI algorithms
  - Random move generation (Easy AI)
  - Minimax with Alpha-Beta pruning (Hard AI)
  - Move evaluation and selection

#### Infrastructure Layer (Types & Utils)
- `game.ts`: Type definitions and interfaces
- `constants.ts`: Game constants and messages

## Key Features

### React Hooks Usage
- **useState**: Game state management
- **useCallback**: Memoized event handlers and functions
- **useEffect**: AI move delays and side effects

### AI Implementation
- **Easy AI**: Random move selection
- **Hard AI**: Minimax algorithm with Alpha-Beta pruning
- Configurable difficulty levels
- Performance optimized with pruning

### Code Quality Features
- **TypeScript**: Full type safety
- **Modular Design**: Each module has single responsibility
- **Pure Functions**: Business logic is side-effect free
- **Error Handling**: Proper error boundaries and validation
- **Documentation**: Comprehensive JSDoc comments
- **Accessibility**: ARIA labels for screen readers

## Testing Strategy

The clean architecture enables easy testing:
- **Unit Tests**: Test logic modules independently
- **Integration Tests**: Test hooks with logic modules
- **Component Tests**: Test UI components in isolation
- **E2E Tests**: Test complete user workflows

## Benefits

1. **Maintainability**: Clear separation makes code easy to modify
2. **Testability**: Each layer can be tested independently
3. **Reusability**: Logic modules can be reused in different contexts
4. **Scalability**: Easy to add new features without affecting existing code
5. **Type Safety**: Full TypeScript coverage prevents runtime errors