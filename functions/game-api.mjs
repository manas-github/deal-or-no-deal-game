// Standalone Netlify serverless function for Deal or No Deal game
// This avoids dependency issues with the server code

// Game state storage (in-memory for demo purposes)
const games = new Map();

// Game values (classic US version)
const caseValues = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000, 
  5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

// Helper functions
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const calculateOffer = (remainingValues) => {
  // Simple offer calculation: ~80% of average of remaining values
  const average = remainingValues.reduce((sum, val) => sum + val, 0) / remainingValues.length;
  return Math.floor(average * 0.8);
};

// Game logic functions
const createGame = () => {
  const gameId = `game-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const shuffledValues = shuffleArray(caseValues);
  
  const cases = {};
  shuffledValues.forEach((value, index) => {
    cases[index + 1] = { 
      value,
      opened: false
    };
  });
  
  const gameState = {
    id: gameId,
    cases,
    selectedCase: null,
    openedCases: [],
    remainingCases: Array.from({length: 26}, (_, i) => i + 1),
    currentRound: 0,
    lastOffer: null,
    gameStatus: 'new',
    timestamp: Date.now()
  };
  
  games.set(gameId, gameState);
  return { 
    gameId, 
    status: 'new',
    remainingCases: gameState.remainingCases
  };
};

const selectCase = (gameId, caseNumber) => {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  
  if (game.selectedCase !== null) {
    return { error: 'Case already selected' };
  }
  
  game.selectedCase = caseNumber;
  game.remainingCases = game.remainingCases.filter(c => c !== caseNumber);
  game.gameStatus = 'case_selected';
  
  return {
    gameId,
    selectedCase: caseNumber,
    remainingCases: game.remainingCases,
    status: game.gameStatus
  };
};

const openCase = (gameId, caseNumber) => {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  
  if (game.selectedCase === null) {
    return { error: 'Must select your case first' };
  }
  
  if (caseNumber === game.selectedCase) {
    return { error: 'Cannot open your selected case' };
  }
  
  if (game.cases[caseNumber].opened) {
    return { error: 'Case already opened' };
  }
  
  game.cases[caseNumber].opened = true;
  game.openedCases.push(caseNumber);
  game.remainingCases = game.remainingCases.filter(c => c !== caseNumber);
  
  const value = game.cases[caseNumber].value;
  
  return {
    gameId,
    openedCase: caseNumber,
    value,
    remainingCases: game.remainingCases
  };
};

const makeOffer = (gameId) => {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  
  const remainingValues = game.remainingCases.map(caseNum => game.cases[caseNum].value);
  const offer = calculateOffer(remainingValues);
  
  game.lastOffer = offer;
  game.currentRound++;
  game.gameStatus = 'offer_made';
  
  return {
    gameId,
    offer,
    round: game.currentRound
  };
};

const acceptOffer = (gameId) => {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  
  if (game.lastOffer === null) {
    return { error: 'No offer to accept' };
  }
  
  game.gameStatus = 'deal';
  
  // Reveal what was in the contestant's case
  const selectedCaseValue = game.cases[game.selectedCase].value;
  
  return {
    gameId,
    outcome: 'deal',
    amount: game.lastOffer,
    selectedCaseValue,
    status: game.gameStatus
  };
};

const rejectOffer = (gameId) => {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  
  if (game.lastOffer === null) {
    return { error: 'No offer to reject' };
  }
  
  game.gameStatus = 'no_deal';
  
  return {
    gameId,
    outcome: 'no_deal',
    remainingCases: game.remainingCases,
    status: game.gameStatus
  };
};

// Main handler function
export const handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/game-api', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    
    console.log(`Handling ${method} request to ${path}`);
    
    // API routes
    if ((path === '' || path === '/') && method === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Deal or No Deal Game API' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/new' && method === 'POST') {
      const result = createGame();
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/select-case' && method === 'POST') {
      const { gameId, caseNumber } = body;
      const result = selectCase(gameId, parseInt(caseNumber));
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/open-case' && method === 'POST') {
      const { gameId, caseNumber } = body;
      const result = openCase(gameId, parseInt(caseNumber));
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/banker-offer' && method === 'POST') {
      const { gameId } = body;
      const result = makeOffer(gameId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/accept-offer' && method === 'POST') {
      const { gameId } = body;
      const result = acceptOffer(gameId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/reject-offer' && method === 'POST') {
      const { gameId } = body;
      const result = rejectOffer(gameId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    // Default response for unhandled routes
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' }),
      headers: { 'Content-Type': 'application/json' }
    };
    
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
