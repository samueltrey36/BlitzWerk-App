import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './lib/authStore.tsx';
import { JobProvider } from './lib/jobStore.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <JobProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </JobProvider>
    </AuthProvider>
  </StrictMode>,
);
