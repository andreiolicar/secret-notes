import { useState } from 'react';
import AuthModal from './components/AuthModal';
import MainApp from './pages/MainApp';
import './styles/index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthModal onAuthenticated={handleAuthenticated} />;
  }

  return <MainApp />;
}

export default App;