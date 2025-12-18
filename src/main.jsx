import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Database } from './entities/Database';

// Initialize the local database before mounting React
Database.init().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
