import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BlueprintCreate from './pages/BlueprintCreate';
import BlueprintDetail from './pages/BlueprintDetail';
import BlueprintsGallery from './pages/BlueprintsGallery';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';

function AppShell() {
  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<BlueprintsGallery />} path="/" />
        <Route element={<BlueprintsGallery />} path="/blueprints" />
        <Route element={<BlueprintCreate />} path="/blueprints/new" />
        <Route element={<BlueprintDetail />} path="/blueprints/:id" />
      </Route>
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
