import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const { user, logout } = useAuth();
  
  const navLinks = [
    { path: '/mesero', label: 'Mesero', icon: 'restaurant_menu' },
    { path: '/barra', label: 'Barra', icon: 'local_bar' },
    { path: '/cocina-caliente', label: 'Cocina Caliente', icon: 'local_fire_department' },
    { path: '/cocina-fria', label: 'Cocina Fría', icon: 'ac_unit' }
  ];

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
          {navLinks.map((link) => (
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
