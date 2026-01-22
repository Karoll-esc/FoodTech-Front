import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import type { PermissionValue } from '../hooks/usePermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: PermissionValue;
  anyPermissions?: PermissionValue[];
  redirectPath?: string;
}

export const ProtectedRoute = ({
  children,
  requiredPermission,
  anyPermissions,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-white-text">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    void login();
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-900/20 p-6 text-center text-white-text">
        <p className="text-lg font-semibold">Acceso denegado</p>
        <p className="text-sm text-silver-text">
          Tu perfil no cuenta con los permisos necesarios para acceder a esta sección.
        </p>
      </div>
    );
  }

  if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-900/20 p-6 text-center text-white-text">
        <p className="text-lg font-semibold">Acceso restringido</p>
        <p className="text-sm text-silver-text">
          Necesitas permisos adicionales para ver este contenido.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
