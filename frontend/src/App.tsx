import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import BlueprintCreate from './pages/BlueprintCreate';
import BlueprintDetail from './pages/BlueprintDetail';
import BlueprintsGallery from './pages/BlueprintsGallery';
import AdminClients from './pages/AdminClients';
import AdminOverview from './pages/AdminOverview';
import AdminUsers from './pages/AdminUsers';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
        path="/admin"
      >
        <Route element={<AdminOverview />} index />
        <Route element={<AdminClients />} path="clients" />
        <Route element={<AdminUsers />} path="users" />
        <Route element={<BlueprintsGallery />} path="blueprints" />
        <Route element={<BlueprintCreate />} path="blueprints/new" />
        <Route element={<BlueprintDetail />} path="blueprints/:id" />
      </Route>
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Navigate replace to="/admin/blueprints" />} path="/blueprints" />
      <Route element={<Navigate replace to="/admin/blueprints/new" />} path="/blueprints/new" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
