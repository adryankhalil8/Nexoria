export type ManagedUser = {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
};

export type CreateManagedUserInput = {
  email: string;
  username: string;
  role: ManagedUser['role'];
};

export type LeadStatus = 'NEW' | 'CONTACTED' | 'BOOKED' | 'QUALIFIED' | 'CLOSED';

export type Lead = {
  id: number;
  userId?: number | null;
  company: string;
  contactName: string;
  email: string;
  website?: string;
  industry?: string;
  notes?: string;
  status: LeadStatus;
  hasAccount: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LeadDraft = {
  company: string;
  contactName: string;
  email: string;
  website: string;
  industry: string;
  notes: string;
  status: LeadStatus;
};

export const USER_ROLE_OPTIONS: ManagedUser['role'][] = ['ADMIN', 'USER', 'VIEWER'];
export const LEAD_STATUS_OPTIONS: LeadStatus[] = ['NEW', 'CONTACTED', 'BOOKED', 'QUALIFIED', 'CLOSED'];
