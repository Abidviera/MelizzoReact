import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
