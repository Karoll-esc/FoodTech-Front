import { useMemo, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const PERMISSIONS = {
  READ_ORDERS: 'read:orders',
  CREATE_ORDERS: 'create:orders',
  READ_TASKS: 'read:tasks',
  ADMIN_ALL: 'admin:all',
  UPDATE_TABLES: 'update:tables',
  UPDATE_TASKS_PASTRY: 'update:tasks:pastry-station',
  UPDATE_TASKS_SANDWICH: 'update:tasks:sandwich-station',
} as const;

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Helper to decode JWT without verification (client-side only)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const usePermissions = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth();
  const [accessTokenPermissions, setAccessTokenPermissions] = useState<string[]>([]);

  // Fetch and decode access token to get permissions
  useEffect(() => {
    if (!isAuthenticated) {
      setAccessTokenPermissions([]);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const decoded = decodeJWT(token);
        console.log('🔓 Decoded Access Token:', decoded);

        // Extract permissions from access token
        const permissions = decoded?.permissions || decoded?.scope?.split(' ') || [];
        console.log('✅ Permissions from Access Token:', permissions);
        setAccessTokenPermissions(permissions);
      } catch (error) {
        console.error('❌ Error fetching access token:', error);
        setAccessTokenPermissions([]);
      }
    };

    fetchPermissions();
  }, [isAuthenticated, getAccessTokenSilently]);

  const scopes = useMemo(() => {
    // Priority 1: Use permissions from access token
    if (accessTokenPermissions.length > 0) {
      return accessTokenPermissions;
    }

    // Fallback: Try to get from user object (ID token)
    if (!user) {
      return [] as string[];
    }

    // Try multiple ways to get permissions from ID token
    const audienceKey = `${import.meta.env.VITE_AUTH0_AUDIENCE}/permissions`;
    const audiencePermissions = user[audienceKey] as string[] | undefined;
    
    if (Array.isArray(audiencePermissions) && audiencePermissions.length > 0) {
      console.log('✅ Found permissions in ID token audience namespace:', audiencePermissions);
      return audiencePermissions;
    }

    const directPermissions = (user as any).permissions as string[] | undefined;
    if (Array.isArray(directPermissions) && directPermissions.length > 0) {
      console.log('✅ Found permissions in ID token:', directPermissions);
      return directPermissions;
    }

    if (typeof user?.scope === 'string' && user.scope) {
      const scopeArray = user.scope.split(' ');
      console.log('✅ Found scopes in ID token scope string:', scopeArray);
      return scopeArray;
    }

    console.warn('⚠️ No permissions found');
    return [] as string[];
  }, [user, accessTokenPermissions]);

  const hasPermission = (permission: PermissionValue) => {
    const result = scopes.includes(permission);
    console.log(`🔐 Checking permission "${permission}":`, result);
    return result;
  };

  const hasAnyPermission = (permissions: PermissionValue[]) => {
    const result = permissions.some((permission) => hasPermission(permission));
    console.log(`🔐 Checking any of [${permissions.join(', ')}]:`, result);
    return result;
  };

  return {
    permissions: scopes,
    hasPermission,
    hasAnyPermission,
    PERMISSIONS,
  };
};
