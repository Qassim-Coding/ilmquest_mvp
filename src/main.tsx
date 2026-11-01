import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
// Polices embarquées dans l'app : elles fonctionnent hors ligne (PWA et app Capacitor)
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/noto-sans-arabic';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
