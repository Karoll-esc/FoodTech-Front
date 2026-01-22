import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WaiterView } from './views/WaiterView';
import { HotKitchenView } from './views/HotKitchenView';
import { BarView } from './views/BarView';
import { ColdKitchenView } from './views/ColdKitchenView';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoading, isAuthenticated, login } = useAuth();

  // Show loading while Auth0 initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-white-text text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    login();
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-white-text text-center">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navigation />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/mesero" replace />} />
          <Route 
            path="/mesero" 
            element={
              <ProtectedRoute requiredPermission="create:orders">
                <WaiterView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cocina-caliente" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'update:tasks:pastry-station']}>
                <HotKitchenView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/barra" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'admin:all']}>
                <BarView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cocina-fria" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'update:tasks:sandwich-station']}>
                <ColdKitchenView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
