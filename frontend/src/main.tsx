import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ConfigProvider } from './lib/ConfigContext';
import { LanguageProvider } from './lib/LanguageContext';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initGlobalErrorListeners } from './lib/errorLogger';

import { BrowserRouter } from 'react-router-dom';

// Initialize global runtime error listener
initGlobalErrorListeners();

// Register service worker
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </LanguageProvider>
    </ConfigProvider>
  </StrictMode>,
);
