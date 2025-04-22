// Netlify serverless function to handle game server functionality
// Simple mock implementations for game logic
const createGame = () => ({ id: `game-${Date.now()}`, status: 'new' });
const selectCase = (gameId, caseNumber) => ({ gameId, selectedCase: caseNumber });
const openCase = (gameId, caseNumber) => ({ gameId, openedCase: caseNumber, value: Math.floor(Math.random() * 1000000) });
const makeOffer = (gameId) => Math.floor(Math.random() * 500000);
const acceptOffer = (gameId, offer) => ({ gameId, outcome: 'accepted', amount: offer });
const rejectOffer = (gameId) => ({ gameId, outcome: 'rejected' });

export const handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/server', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Simple router for game actions
    if (path === '/api/game/new' && method === 'POST') {
      const game = createGame();
      return {
        statusCode: 200,
        body: JSON.stringify(game),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/select-case' && method === 'POST') {
      const { gameId, caseNumber } = body;
      const result = selectCase(gameId, caseNumber);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/open-case' && method === 'POST') {
      const { gameId, caseNumber } = body;
      const result = openCase(gameId, caseNumber);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/banker-offer' && method === 'POST') {
      const { gameId } = body;
      const offer = makeOffer(gameId);
      return {
        statusCode: 200,
        body: JSON.stringify({ offer }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    if (path === '/api/game/accept-offer' && method === 'POST') {
      const { gameId, offer } = body;
      const result = acceptOffer(gameId, offer);
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
