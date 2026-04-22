import { FormEvent, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { supportApi } from '../api/support';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';
import type { SupportMessage } from '../model/support';

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function mergeMessage(current: SupportMessage[], message: SupportMessage) {
  if (current.some((item) => item.id === message.id)) {
    return current;
  }

  return [...current, message].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export default function ClientSupport() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    try {
      setMessages(await supportApi.getMine());
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to load support messages'));
    }
  }

  useEffect(() => {
    void loadMessages();
    let fallbackInterval: number | undefined;
    const unsubscribe = supportApi.subscribeMine(
      (message) => {
        setMessages((current) => mergeMessage(current, message));
      },
      () => {
        fallbackInterval = window.setInterval(() => void loadMessages(), 5000);
      }
    );
    return () => {
      unsubscribe();
      if (fallbackInterval) {
        window.clearInterval(fallbackInterval);
      }
    };
  }, []);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) {
      return;
    }

    try {
      const saved = await supportApi.sendMine({ body });
      setMessages((current) => mergeMessage(current, saved));
      setBody('');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to send support message'));
    }
  }

  if (isLoading) {
    return <section className="card">Loading support feed...</section>;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Support</p>
        <h2>Message Nexoria</h2>
        <p className="muted">
          Send updates, blockers, approvals, or questions from the portal. Replies from Nexoria stream here in real time.
        </p>
      </div>

      {portal?.weeklyNotes.length ? (
        <article className="card stack">
          <p className="eyebrow">Latest install note</p>
          <p className="muted">{portal.weeklyNotes[0]}</p>
        </article>
      ) : null}

      <div className="support-message-list card">
        {messages.map((message) => (
          <article
            className={message.sender === 'CLIENT' ? 'support-message support-message--client' : 'support-message support-message--admin'}
            key={message.id}
          >
            <div className="fix-list__header">
              <strong>{message.sender === 'CLIENT' ? 'You' : 'Nexoria'}</strong>
              <span className="muted">{formatMessageTime(message.createdAt)}</span>
            </div>
            <p>{message.body}</p>
          </article>
        ))}
        {!messages.length && <p className="muted">No messages yet. Start the thread when you need help.</p>}
      </div>

      <form className="card stack-form" onSubmit={sendMessage}>
        <label>
          New message
          <textarea onChange={(event) => setBody(event.target.value)} rows={5} value={body} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="primary-button" type="submit">
          Send Message
        </button>
      </form>
    </section>
  );
}
