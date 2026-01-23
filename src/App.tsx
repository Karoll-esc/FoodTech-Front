import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WaiterView } from './views/WaiterView';
import { PastryStationView } from './views/PastryStationView';
import { EspressoBarView } from './views/EspressoBarView';
import { SandwichStationView } from './views/SandwichStationView';
import { ProductManagementView } from './views/admin/ProductManagementView';
import { TableManagementView } from './views/admin/TableManagementView';
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1E2E',
            color: '#F5F5F0',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1E1E2E',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1E1E2E',
            },
          },
        }}
      />
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
            path="/estacion-reposteria" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'update:tasks:pastry-station']}>
                <PastryStationView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/barra-espresso" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'admin:all']}>
                <EspressoBarView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/estacion-sandwiches" 
            element={
              <ProtectedRoute anyPermissions={['read:tasks', 'update:tasks:sandwich-station']}>
                <SandwichStationView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/productos" 
            element={
              <ProtectedRoute requiredPermission="admin:all">
                <ProductManagementView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/mesas" 
            element={
              <ProtectedRoute anyPermissions={['admin:all', 'update:tables']}>
                <TableManagementView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
