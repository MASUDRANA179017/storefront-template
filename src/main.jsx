import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './lib/CartContext';
import { AuthProvider } from './lib/AuthContext';
import { WishlistProvider } from './lib/WishlistContext';
import { NotificationProvider } from './lib/NotificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
