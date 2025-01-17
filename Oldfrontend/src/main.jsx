import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from "./components/Theme-provider.tsx";
import { NavbarComponent } from './components/NavBarComponents.tsx'
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
      </AuthProvider>
  </StrictMode>

);
