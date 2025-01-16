import { Chat } from './components/Chat';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function AppContent() {
  const { isAuthenticated, showLogin } = useAuth();

  if (isAuthenticated) {
    return <Chat />;
  }

  return showLogin ? <Login /> : <Signup />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
