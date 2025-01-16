import { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import { SOCKET_URL } from '../config';

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
    avatar?: string;
    isBot?: boolean;
  };
  timestamp: string;
}

export function Chat() {
  const { userId, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('jwt') },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('chat message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const isMessageFromUser = (senderId: number) => senderId === userId;

  const MessageBubble = ({ msg }: { msg: Message }) => {
    const fromUser = isMessageFromUser(msg.sender.id);

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: fromUser ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        {!fromUser && (
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              width: 36,
              height: 36,
              mr: 1,
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
        )}
        <Box
          sx={{
            maxWidth: '70%',
            p: 1.5,
            bgcolor: fromUser ? '#DCF8C6' : '#FFFFFF',
            color: fromUser ? '#000' : '#000',
            borderRadius: fromUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
            boxShadow: 1,
          }}
        >
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            {msg.content}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
              color: '#999',
            }}
          >
            {format(new Date(msg.timestamp), 'HH:mm')}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleLogout = () => {
    if (socket) {
      socket.close();
    }
    logout();
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#E5DDD5',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#075E54',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Strapi Chat</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            sx={{ ml: 1 }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
        }}
      >
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          bgcolor: '#FFFFFF',
          borderTop: '1px solid #DDD',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 25,
                bgcolor: '#F0F0F0',
                px: 2,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!isConnected || !message.trim()}
            sx={{
              bgcolor: '#075E54',
              color: '#FFFFFF',
              borderRadius: '50%',
              minWidth: 48,
              height: 48,
              '&:hover': {
                bgcolor: '#128C7E',
              },
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
