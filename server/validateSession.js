const redisClient = require('./redisClient');

async function validateSession(sessionId) {
  let rawId = sessionId.startsWith('s:') ? sessionId.slice(2) : sessionId;

  if (rawId.includes('.')) {
    rawId = rawId.split('.')[0];
  }

  const key = `autoflow:session:${rawId}`;
  console.log('[SERVER] validateSession looking for key:', key);

  try {
    const data = await redisClient.get(key);
    console.log('[SERVER] redisClient.get returned:', data);

    if (!data) {
      console.log('[SERVER] validateSession no data for key:', key);
      return null;
    }

    const session = JSON.parse(data);
    console.log('[SERVER] validateSession parsed session:', session);

    if (session.passport && session.passport.user) {
      console.log('[SERVER] validateSession user found:', session.passport.user);
      return { id: session.passport.user };
    }

    console.log('[SERVER] validateSession no user found in session');
    return null;
  } catch (err) {
    console.log('[SERVER] validateSession parse error:', err);
    throw err;
  }
}

module.exports = validateSession;

