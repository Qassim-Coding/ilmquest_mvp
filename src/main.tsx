import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
// Polices embarquées dans l'app : elles fonctionnent hors ligne (PWA et app Capacitor)
import '@fontsource-variable/plus-jakarta-sans';
// Arabe : Noto Naskh Arabic, graisses normale (400) et grasse (700)
import '@fontsource/noto-naskh-arabic/400.css';
import '@fontsource/noto-naskh-arabic/700.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
