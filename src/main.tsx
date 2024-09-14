import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { SettlementProvider } from './context/SettlementContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <SettlementProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SettlementProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
