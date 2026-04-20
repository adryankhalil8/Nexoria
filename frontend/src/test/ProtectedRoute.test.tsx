import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import ProtectedRoute from '../routes/ProtectedRoute';

function renderRoutes(initialPath: string) {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          element={
            <ProtectedRoute requireRole="ADMIN">
              <div>Admin Area</div>
            </ProtectedRoute>
          }
          path="/admin"
        />
        <Route
          element={
            <ProtectedRoute requireRole="USER">
              <div>Client Portal</div>
            </ProtectedRoute>
          }
          path="/portal"
        />
        <Route element={<div>Login Page</div>} path="/login" />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('redirects unauthenticated users to login', () => {
    renderRoutes('/portal');

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('keeps admins out of the client portal and sends them back to admin', () => {
    localStorage.setItem('nexoria-token', 'token');
    localStorage.setItem('nexoria-role', 'ADMIN');

    renderRoutes('/portal');

    expect(screen.getByText(/admin area/i)).toBeInTheDocument();
  });

  it('keeps client users out of the admin area and sends them back to portal', () => {
    localStorage.setItem('nexoria-token', 'token');
    localStorage.setItem('nexoria-role', 'USER');

    renderRoutes('/admin');

    expect(screen.getByText(/client portal/i)).toBeInTheDocument();
  });
});
