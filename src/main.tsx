import { StrictMode, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { registerAccessTokenProvider } from './services/apiClient';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI ?? window.location.origin;

if (!domain || !clientId) {
  console.error(
    'Auth0 environment variables (VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID) are required.'
  );
}

const requestedScope =
  'openid profile email offline_access read:orders create:orders read:tasks admin:all update:tables update:tasks:pastry-station update:tasks:sandwich-station';

export const AuthTokenBridge = ({ children }: { children: ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    registerAccessTokenProvider(() =>
      getAccessTokenSilently({
        authorizationParams: {
          audience: audience ?? undefined,
          scope: requestedScope,
        },
      })
    );
  }, [getAccessTokenSilently]);

  return children;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain ?? ''}
      clientId={clientId ?? ''}
      authorizationParams={{
        audience: audience ?? undefined,
        redirect_uri: redirectUri,
        scope: requestedScope,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <AuthTokenBridge>
        <App />
      </AuthTokenBridge>
    </Auth0Provider>
  </StrictMode>
);
