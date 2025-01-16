# Real-Time Chat Application

A full-stack real-time chat application built with Strapi, Socket.IO, React, and Material-UI.

## Features

- 🔐 User Authentication
- 💬 Real-time messaging
- 📱 Responsive design
- 🔄 Message delivery status
- ⚡ WebSocket connection
- 🌐 Cross-browser support

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for UI components
- Socket.IO client for real-time communication
- Vite for build tooling
- Axios for HTTP requests

### Backend
- Strapi headless CMS
- Socket.IO for WebSocket server
- JWT authentication
- SQLite database (configurable)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/chat-application.git
cd chat-application
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Configuration

1. Backend Configuration
```bash
# In backend/.env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-keys-here
API_TOKEN_SALT=your-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

2. Frontend Configuration
```bash
# In frontend/.env
VITE_API_URL=http://localhost:1337
```

### Running the Application

1. Start the Backend
```bash
cd backend
npm run develop
```

2. Start the Frontend
```bash
cd frontend
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend Admin: http://localhost:1337/admin

## Development

### Backend Structure
```
backend/
├── src/
│   ├── api/
│   │   └── message/
│   └── services/
│       └── websocket.ts
└── config/
    └── middlewares.ts
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Chat.tsx
│   │   └── Login.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── config.ts
└── .env
```

## Deployment

### Frontend (Vercel)
1. Create a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel --prod`

### Backend (Strapi Cloud)
1. Create a Strapi Cloud account
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- Strapi team for the amazing headless CMS
- Material-UI team for the component library
- Socket.IO team for real-time capabilities 
