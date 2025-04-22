# Deal or No Deal Game

A web-based implementation of the popular "Deal or No Deal" game show with all the classic gameplay elements.

## Features

- Interactive briefcase selection
- Dynamic value board showing eliminated values
- Realistic banker offers based on game progress
- Sound effects for game events
- Game statistics tracking
- Mobile-responsive design

## How to Play

1. **Select Your Case**: Choose one of the 26 briefcases to keep as your own
2. **Elimination Rounds**: In each round, open a set number of cases to eliminate those values
3. **Banker Offers**: After each round, the banker will make an offer to buy your case
4. **Deal or No Deal**: Decide whether to accept the banker's offer or continue playing
5. **Final Outcome**: See how much your case was worth and whether your decisions paid off

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Backend**: Express.js
- **Storage**: In-memory data store
- **Sound Effects**: Howler.js
- **Build Tools**: Vite

## Local Development

To run this project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`.

## Game Design

The game includes 26 briefcases with values ranging from $0.01 to $1,000,000. The banker's offers are calculated based on the expected value of remaining cases and the current round number.

## License

MIT