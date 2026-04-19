import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ClientPortalLayout from './components/ClientPortalLayout';
import BlueprintCreate from './pages/BlueprintCreate';
import BlueprintDetail from './pages/BlueprintDetail';
import BlueprintsGallery from './pages/BlueprintsGallery';
import AdminClients from './pages/AdminClients';
import AdminBootstrap from './pages/AdminBootstrap';
import AdminBookedCalls from './pages/AdminBookedCalls';
import AdminOverview from './pages/AdminOverview';
import AdminScheduleSettings from './pages/AdminScheduleSettings';
import AdminSupportMessages from './pages/AdminSupportMessages';
import AdminUsers from './pages/AdminUsers';
import BookingConfirmation from './pages/BookingConfirmation';
import ClientBlueprint from './pages/ClientBlueprint';
import ClientHome from './pages/ClientHome';
import ClientNextSteps from './pages/ClientNextSteps';
import ClientResults from './pages/ClientResults';
import ClientSupport from './pages/ClientSupport';
import GetStarted from './pages/GetStarted';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ScheduleCall from './pages/ScheduleCall';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<GetStarted />} path="/get-started" />
      <Route
        element={
          <ProtectedRoute requireRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
        path="/admin"
      >
        <Route element={<AdminOverview />} index />
        <Route element={<AdminClients />} path="clients" />
        <Route element={<AdminBookedCalls />} path="calls" />
        <Route element={<AdminScheduleSettings />} path="schedule" />
        <Route element={<AdminSupportMessages />} path="support" />
        <Route element={<AdminUsers />} path="users" />
        <Route element={<BlueprintsGallery />} path="blueprints" />
        <Route element={<BlueprintCreate />} path="blueprints/new" />
        <Route element={<BlueprintDetail />} path="blueprints/:id" />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <ClientPortalLayout />
          </ProtectedRoute>
        }
        path="/portal"
      >
        <Route element={<ClientHome />} index />
        <Route element={<ClientBlueprint />} path="blueprint" />
        <Route element={<ClientNextSteps />} path="next-steps" />
        <Route element={<ClientResults />} path="results" />
        <Route element={<ClientSupport />} path="support" />
      </Route>
      <Route element={<AdminBootstrap />} path="/admin-access" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<ScheduleCall />} path="/schedule" />
      <Route element={<BookingConfirmation />} path="/schedule/confirmation" />
      <Route element={<Navigate replace to="/admin/blueprints" />} path="/blueprints" />
      <Route element={<Navigate replace to="/admin/blueprints/new" />} path="/blueprints/new" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
