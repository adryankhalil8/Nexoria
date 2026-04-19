export type SupportMessage = {
  id: number;
  clientEmail: string;
  businessName?: string;
  sender: 'CLIENT' | 'ADMIN';
  body: string;
  createdAt: string;
};

export type SupportMessageRequest = {
  body: string;
};
