import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { configureAmplify, isCognitoConfigured } from './amplify-config.js';
import { AuthProvider } from './context/AuthContext.jsx';

// Initialize Amplify if Cognito is configured
if (isCognitoConfigured()) {
  configureAmplify();
} else {
  console.info(
    '[GetItDone] Cognito not configured yet — running in mock auth mode.\n' +
    'See src/amplify-config.js to connect your AWS User Pool.'
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
