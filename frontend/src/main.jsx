import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "./components/Theme-provider.tsx";
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
     <App />    
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
