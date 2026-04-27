import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AdminClients from '../pages/AdminClients';

const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true };

const apiMocks = vi.hoisted(() => ({
  leadsGetAll: vi.fn(),
  leadsCreate: vi.fn(),
  leadsUpdate: vi.fn(),
  leadsDelete: vi.fn(),
  usersGetAll: vi.fn(),
  blueprintsGetAll: vi.fn(),
}));

vi.mock('../api/leads', () => ({
  leadsApi: {
    getAll: apiMocks.leadsGetAll,
    create: apiMocks.leadsCreate,
    update: apiMocks.leadsUpdate,
    delete: apiMocks.leadsDelete,
  },
}));

vi.mock('../api/users', () => ({
  usersApi: {
    getAll: apiMocks.usersGetAll,
  },
}));

vi.mock('../api/blueprint', () => ({
  blueprintApi: {
    getAll: apiMocks.blueprintsGetAll,
  },
}));

describe('admin workflow handoffs', () => {
  it('links a booked client tracker row into blueprint creation and related workspace views', async () => {
    apiMocks.leadsGetAll.mockResolvedValue([
      {
        id: 1,
        company: 'Booked Client Co',
        contactName: 'Jordan Client',
        email: 'client@example.com',
        website: 'https://client.example.com',
        industry: 'Consulting',
        notes: '',
        status: 'BOOKED',
        hasAccount: false,
        createdAt: '2026-04-20T12:00:00Z',
        updatedAt: '2026-04-20T12:00:00Z',
      },
    ]);
    apiMocks.usersGetAll.mockResolvedValue([]);
    apiMocks.blueprintsGetAll.mockResolvedValue([]);

    render(
      <MemoryRouter future={routerFuture} initialEntries={['/admin/clients']}>
        <AdminClients />
      </MemoryRouter>
    );

    expect(await screen.findByText(/booked client co/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create blueprint/i })).toHaveAttribute(
      'href',
      '/admin/blueprints/new?clientEmail=client%40example.com&url=https%3A%2F%2Fclient.example.com&industry=Consulting'
    );
    expect(screen.getByRole('link', { name: /calls/i })).toHaveAttribute(
      'href',
      '/admin/calls?search=client%40example.com'
    );
    expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute(
      'href',
      '/admin/support?search=client%40example.com'
    );
  });

  it('shows the assigned blueprint link when a client already has one', async () => {
    apiMocks.leadsGetAll.mockResolvedValue([
      {
        id: 2,
        company: 'Assigned Client Co',
        contactName: 'Casey Client',
        email: 'assigned@example.com',
        website: 'https://assigned.example.com',
        industry: 'Concrete / flooring / remodeling',
        notes: '',
        status: 'CLOSED',
        hasAccount: true,
        createdAt: '2026-04-20T12:00:00Z',
        updatedAt: '2026-04-20T12:00:00Z',
      },
    ]);
    apiMocks.usersGetAll.mockResolvedValue([
      {
        id: 3,
        email: 'assigned@example.com',
        username: 'assigned',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2026-04-20T12:00:00Z',
        updatedAt: '2026-04-20T12:00:00Z',
      },
    ]);
    apiMocks.blueprintsGetAll.mockResolvedValue([
      {
        id: 42,
        url: 'https://assigned.example.com',
        industry: 'Remodeling',
        revenueRange: '$10k-$50k/mo',
        clientEmail: 'assigned@example.com',
        status: 'APPROVED',
        purchaseEventType: 'BOOKED_JOB',
        goals: ['Book more jobs'],
        fixes: [],
        createdAt: '2026-04-20T12:00:00Z',
      },
    ]);

    render(
      <MemoryRouter future={routerFuture} initialEntries={['/admin/clients']}>
        <AdminClients />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/blueprint assigned/i)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /view blueprint/i })).toHaveAttribute(
      'href',
      '/admin/blueprints/42'
    );
  });
});
