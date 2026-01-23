import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions, type PermissionValue } from '../hooks/usePermissions';

export function Navigation() {
  const { user, logout } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  const navLinks = [
    { path: '/mesero', label: 'Mesero', icon: 'restaurant_menu', show: hasPermission('create:orders') },
    { path: '/barra-espresso', label: 'Espresso', icon: 'coffee', show: hasAnyPermission(['read:tasks', 'admin:all']) },
    { path: '/estacion-reposteria', label: 'Repostería', icon: 'bakery_dining', show: hasAnyPermission(['read:tasks', 'update:tasks:pastry-station', 'admin:all']) },
    { path: '/estacion-sandwiches', label: 'Sandwiches', icon: 'lunch_dining', show: hasAnyPermission(['read:tasks', 'update:tasks:sandwich-station', 'admin:all']) }
  ];

  const adminLinks: Array<{
    path: string;
    label: string;
    icon: string;
    requiredPermissions: PermissionValue[];
  }> = [
    {
      path: '/admin/productos',
      label: 'Productos',
      icon: 'inventory_2',
      requiredPermissions: ['admin:all']
    },
    {
      path: '/admin/mesas',
      label: 'Mesas',
      icon: 'table_restaurant',
      requiredPermissions: ['admin:all']
    }
  ];

  const visibleAdminLinks = adminLinks.filter(link =>
    hasAnyPermission(link.requiredPermissions)
  );

  const showAdmin = visibleAdminLinks.length > 0;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-charcoal border-b border-white/10 z-50">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="size-10 gold-gradient rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-midnight text-2xl font-bold">restaurant</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white-text">FoodTech</h1>
            <p className="text-[10px] text-primary uppercase tracking-wider">Kitchen System</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          {navLinks.filter(link => link.show).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }: { isActive: boolean }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  isActive
                    ? 'gold-gradient text-midnight shadow-lg shadow-primary/20'
                    : 'text-silver-text hover:text-white-text hover:bg-white/5'
                }`
              }
            >
              <span className="material-symbols-outlined text-lg">{link.icon}</span>
              <span className="hidden md:inline">{link.label}</span>
            </NavLink>
          ))}

          {/* Admin Menu */}
          {showAdmin && (
            <div className="relative group ml-2">
              <button className="px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 text-silver-text hover:text-white-text hover:bg-white/5">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                <span className="hidden md:inline">Admin</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-charcoal/95 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all backdrop-blur-md">
                {visibleAdminLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }: { isActive: boolean }) =>
                      `flex items-center gap-2 px-4 py-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-silver-text hover:text-white-text hover:bg-white/10'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-lg">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
          
          {/* User Info & Logout */}
          <div className="ml-4 flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden md:block">
              <p className="text-sm text-white-text font-medium">{user?.name}</p>
              <p className="text-xs text-silver-text">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm text-silver-text hover:text-white-text hover:bg-red-900/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
