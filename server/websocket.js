const { Server } = require('socket.io');
const cookie = require('cookie');
const validateSession = require('./validateSession');
const pool = require('./db');

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
    io.use(async (socket, next) => {
      console.log('[SERVER] cookie header:', socket.handshake.headers.cookie || 'NO COOKIE HEADER');
      const header = socket.handshake.headers.cookie;
      if (!header) {
        console.log('[SERVER] No cookie found in handshake');
        return next(new Error('No cookie'));
      }
      const cookies = cookie.parse(header);
      const sid = cookies['connect.sid'];
      console.log('[SERVER] session ID from cookie:', sid);
      if (!sid) {
        console.log('[SERVER] No session ID in cookie');
        return next(new Error('No session'));
      }
      try {
        const user = await validateSession(sid);
        console.log('[SERVER] validateSession result:', user);
        if (!user) {
          console.log('[SERVER] Invalid session');
          return next(new Error('Invalid session'));
        }
        socket.user = user;
        next();
      } catch (err) {
        console.log('[SERVER] validateSession error:', err);
        next(err);
      }   
  });
  io.on('connection', (socket) => {
    console.log('[SERVER] A client connected, user:', socket.user);
    socket.on('join_conversation', (id) => {
      socket.join(`conversation_${id}`);
    });
    socket.on('leave_conversation', (id) => {
      socket.leave(`conversation_${id}`);
    });
    socket.on('send_message', async (data) => {
      console.log('[SERVER] Received send_message with data:', data);
      console.log('[SERVER] socket.user:', socket.user);
    
      try {
        const { conversationId, message } = data;
        console.log('[SERVER] conversationId:', conversationId, ' message:', message);
    
        const c = await pool.query(
          'SELECT * FROM conversations WHERE id=$1 AND (buyer_id=$2 OR seller_id=$2)',
          [conversationId, socket.user && socket.user.id]
        );
        console.log('[SERVER] Found conversation:', c.rows);
    
        if (!c.rows.length) {
          console.log('[SERVER] Unauthorized: user does not belong to conversation');
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }
    
        const r = await pool.query(
          'INSERT INTO messages (conversation_id, sender_id, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
          [conversationId, socket.user.id, message]
        );
        console.log('[SERVER] Inserted message:', r.rows[0]);
    
        io.to(`conversation_${conversationId}`).emit('new_message', r.rows[0]);
      } catch (error) {
        console.error('[SERVER] send_message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
  });
  return io;
}

module.exports = initWebSocket;
