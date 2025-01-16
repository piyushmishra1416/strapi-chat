import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  user: any;
}

interface TokenPayload extends JwtPayload {
  id: number;
}

export default {
  initialize({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
    });

    io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('No token provided');
        }

        // Verify JWT token
        const verified = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
        
        // Get user from database
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: verified.id }
        });

        if (!user) {
          throw new Error('User not found');
        }

        socket.user = user;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
      console.log('A user connected:', socket.user.username);

      // Send typing status
      socket.on('typing', (isTyping) => {
        socket.broadcast.emit('userTyping', {
          user: socket.user.username,
          isTyping
        });
      });

      // Handle chat messages
      socket.on('chat message', async (msg) => {
        try {
          // Store message in database
          const message = await strapi.entityService.create('api::message.message', {
            data: {
              content: msg,
              sender: socket.user.id,
              isDelivered: true
            }
          });

          // Emit message with user info
          io.emit('chat message', {
            id: message.id,
            content: msg,
            sender: {
              id: socket.user.id,
              username: socket.user.username === 'Server' ? 'Server' : socket.user.username,
              isBot: socket.user.username === 'Server'
            },
            timestamp: message.createdAt,
            isDelivered: true
          });
        } catch (error) {
          console.error('Error saving message:', error);
          socket.emit('error', 'Failed to save message');
        }
      });

      // Mark messages as read
      socket.on('markAsRead', async (messageId) => {
        try {
          await strapi.entityService.update('api::message.message', messageId, {
            data: { isRead: true }
          });
          io.emit('messageRead', messageId);
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.username);
      });
    });

    strapi.io = io;
  },
}; 