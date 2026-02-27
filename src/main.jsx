import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './firebase/seed'; // registers window.seedTrip in dev

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
