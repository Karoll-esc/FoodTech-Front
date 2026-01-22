const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI ?? window.location.origin;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export const AUTH_SCOPE =
  'openid profile email offline_access read:orders create:orders read:tasks admin:all update:tables update:tasks:pastry-station update:tasks:sandwich-station';

export const AUTH_AUTHORIZATION_PARAMS = {
  audience: audience ?? undefined,
  scope: AUTH_SCOPE,
  redirect_uri: redirectUri,
};

export const AUTH_REDIRECT_URI = redirectUri;
export const AUTH_AUDIENCE = audience;
