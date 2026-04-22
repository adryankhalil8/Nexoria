import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type React from 'react';
import GetStarted, { SCHEDULE_INTAKE_DRAFT_KEY } from '../pages/GetStarted';
import BookingConfirmation from '../pages/BookingConfirmation';
import ClientBlueprint from '../pages/ClientBlueprint';
import ClientResults from '../pages/ClientResults';
import ClientSupport from '../pages/ClientSupport';
import AdminSupportMessages from '../pages/AdminSupportMessages';
import { buildClientBlueprintView, type Blueprint } from '../model/blueprint';
import type { ScheduledCall } from '../model/scheduling';

const supportApiMock = vi.hoisted(() => ({
  getMine: vi.fn(),
  sendMine: vi.fn(),
  getAdminMessages: vi.fn(),
  replyAsAdmin: vi.fn(),
  subscribeMine: vi.fn((_onMessage?: unknown, _onError?: unknown) => () => undefined),
  subscribeAdmin: vi.fn((_onMessage?: unknown, _onError?: unknown) => () => undefined),
}));

vi.mock('../api/support', () => ({
  supportApi: supportApiMock,
}));

const blueprint: Blueprint = {
  id: 7,
  url: 'https://client.example.com',
  industry: 'HVAC',
  revenueRange: '$10k-$50k/mo',
  clientEmail: 'client@example.com',
  score: 72,
  readyForRetainer: false,
  status: 'APPROVED',
  purchaseEventType: 'BOOKED_JOB',
  goals: ['Book more jobs', 'Collect paid deposits'],
  fixes: [
    {
      title: 'Build the booked-job intake path',
      impact: 'High',
      effort: 'Medium',
      why: 'The current path needs to capture the service need before the lead cools off.',
      owner: 'CLIENT',
      status: 'NOT_STARTED',
      clientVisible: true,
    },
  ],
  externalSignal: { windspeed: 10, weathercode: 0, temperature: 72 },
  createdAt: '2026-04-20T12:00:00Z',
  updatedAt: '2026-04-20T12:00:00Z',
};

function renderWithPortalContext(element: React.ReactNode) {
  render(
    <MemoryRouter initialEntries={['/portal/blueprint']}>
      <Routes>
        <Route
          element={
            <Outlet
              context={{
                portal: buildClientBlueprintView(blueprint),
                bookings: [],
                isLoading: false,
              }}
            />
          }
          path="/portal"
        >
          <Route element={element} path="blueprint" />
          <Route element={element} path="results" />
          <Route element={element} path="support" />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('journey flows', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('carries Get Started intake into scheduling', () => {
    render(
      <MemoryRouter initialEntries={['/get-started']}>
        <Routes>
          <Route element={<GetStarted />} path="/get-started" />
          <Route element={<div>Schedule Page</div>} path="/schedule" />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: { value: 'https://example-client.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue to scheduling/i }));

    expect(screen.getByText(/schedule page/i)).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(SCHEDULE_INTAKE_DRAFT_KEY) ?? '{}')).toMatchObject({
      url: 'https://example-client.com',
      industry: 'HVAC',
      revenueRange: 'Under $5k/mo',
      goals: ['Book more jobs'],
    });
  });

  it('links booking confirmation into client registration', () => {
    const booking: ScheduledCall = {
      id: 1,
      company: 'Client Co',
      contactName: 'Taylor Client',
      email: 'client@example.com',
      website: 'https://client.example.com',
      industry: 'HVAC',
      notes: '',
      timezone: 'America/New_York',
      scheduledStart: '2026-04-21T14:00:00Z',
      scheduledEnd: '2026-04-21T14:45:00Z',
      source: 'GET_STARTED',
      status: 'BOOKED',
      createdAt: '2026-04-20T12:00:00Z',
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/schedule/confirmation', state: { booking } }]}>
        <Routes>
          <Route element={<BookingConfirmation />} path="/schedule/confirmation" />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/your diagnostic is confirmed/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create client account/i })).toHaveAttribute(
      'href',
      '/register?next=%2Fportal&email=client%40example.com'
    );
  });

  it('renders client blueprint selections and hides tracking as not connected', () => {
    renderWithPortalContext(<ClientBlueprint />);

    expect(screen.getByText(/selected goals/i)).toBeInTheDocument();
    expect(screen.getByText(/book more jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/build the booked-job intake path/i)).toBeInTheDocument();
  });

  it('shows honest tracking-not-connected state on client results', () => {
    renderWithPortalContext(<ClientResults />);

    expect(screen.getByText(/tracking not connected/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics access/i)).toBeInTheDocument();
  });

  it('sends a client support message', async () => {
    supportApiMock.getMine.mockResolvedValue([]);
    supportApiMock.sendMine.mockResolvedValue({
      id: 10,
      clientEmail: 'client@example.com',
      businessName: 'Client Co',
      sender: 'CLIENT',
      body: 'Need help with access.',
      createdAt: '2026-04-20T12:00:00Z',
    });

    renderWithPortalContext(<ClientSupport />);

    fireEvent.change(screen.getByLabelText(/new message/i), {
      target: { value: 'Need help with access.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(supportApiMock.sendMine).toHaveBeenCalledWith({ body: 'Need help with access.' });
    });
  });

  it('does not duplicate a sent support message when the stream already added it', async () => {
    let streamHandler: ((message: unknown) => void) | null = null;

    supportApiMock.getMine.mockResolvedValue([]);
    vi.mocked(supportApiMock.subscribeMine).mockImplementation((onMessage: (message: unknown) => void) => {
      streamHandler = onMessage;
      return () => undefined;
    });
    supportApiMock.sendMine.mockImplementation(async () => {
      const saved = {
        id: 10,
        clientEmail: 'client@example.com',
        businessName: 'Client Co',
        sender: 'CLIENT',
        body: 'Need help with access.',
        createdAt: '2026-04-20T12:00:00Z',
      };
      streamHandler?.(saved);
      return saved;
    });

    renderWithPortalContext(<ClientSupport />);

    fireEvent.change(screen.getByLabelText(/new message/i), {
      target: { value: 'Need help with access.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Need help with access.')).toHaveLength(1);
    });
  });

  it('lets admin reply to a support thread', async () => {
    supportApiMock.getAdminMessages.mockResolvedValue([
      {
        id: 11,
        clientEmail: 'client@example.com',
        businessName: 'Client Co',
        sender: 'CLIENT',
        body: 'Can you check this?',
        createdAt: '2026-04-20T12:00:00Z',
      },
    ]);
    supportApiMock.replyAsAdmin.mockResolvedValue({
      id: 12,
      clientEmail: 'client@example.com',
      businessName: 'Client Co',
      sender: 'ADMIN',
      body: 'We are on it.',
      createdAt: '2026-04-20T12:01:00Z',
    });

    render(
      <MemoryRouter initialEntries={['/admin/support']}>
        <AdminSupportMessages />
      </MemoryRouter>
    );

    expect(await screen.findAllByText(/client@example.com/i)).toHaveLength(2);
    fireEvent.change(screen.getByLabelText(/reply/i), { target: { value: 'We are on it.' } });
    fireEvent.click(screen.getByRole('button', { name: /send reply/i }));

    await waitFor(() => {
      expect(supportApiMock.replyAsAdmin).toHaveBeenCalledWith('client@example.com', { body: 'We are on it.' });
    });
  });
});
