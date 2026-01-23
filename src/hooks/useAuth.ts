import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error,
  } = useAuth0();

  return {
    isAuthenticated,
    isLoading,
    user,
    login: () => loginWithRedirect(),
    logout: () =>
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      }),
    getAccessTokenSilently,
    error,
  };
};
