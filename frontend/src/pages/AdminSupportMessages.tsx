import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { supportApi } from '../api/support';
import type { SupportMessage } from '../model/support';

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AdminSupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  async function loadMessages() {
    try {
      const data = await supportApi.getAdminMessages();
      setMessages(data);
      setSelectedEmail((current) => current || data[0]?.clientEmail || '');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to load support messages'));
    }
  }

  useEffect(() => {
    void loadMessages();
    let fallbackInterval: number | undefined;
    const unsubscribe = supportApi.subscribeAdmin(
      (message) => {
        setMessages((current) => {
          if (current.some((item) => item.id === message.id)) {
            return current;
          }

          return [message, ...current].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        });
        setSelectedEmail((current) => current || message.clientEmail);
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

  useEffect(() => {
    const initialSearch = new URLSearchParams(location.search).get('search');
    if (initialSearch) {
      setSelectedEmail(initialSearch);
    }
  }, [location.search]);

  const threads = useMemo(() => {
    const grouped = new Map<string, SupportMessage[]>();
    messages.forEach((message) => {
      grouped.set(message.clientEmail, [...(grouped.get(message.clientEmail) ?? []), message]);
    });
    return Array.from(grouped.entries())
      .map(([email, threadMessages]) => {
        const sortedMessages = [...threadMessages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        const latest = sortedMessages[sortedMessages.length - 1];

        return {
          email,
          businessName: threadMessages[0]?.businessName ?? email,
          latest,
          messages: sortedMessages,
          needsReply: latest?.sender === 'CLIENT',
        };
      })
      .sort((a, b) => (b.latest?.createdAt ?? '').localeCompare(a.latest?.createdAt ?? ''));
  }, [messages]);

  const selectedThread = threads.find((thread) => thread.email === selectedEmail) ?? threads[0];

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!selectedThread || !reply.trim()) {
      return;
    }

    try {
      const saved = await supportApi.replyAsAdmin(selectedThread.email, { body: reply });
      setMessages((current) => [saved, ...current]);
      setReply('');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to send reply'));
    }
  }

  async function deleteThread(clientEmail: string) {
    try {
      setError(null);
      await supportApi.deleteThreadAsAdmin(clientEmail);
      setMessages((current) => current.filter((message) => message.clientEmail !== clientEmail));
      setReply('');
      setSelectedEmail((current) => (current === clientEmail ? '' : current));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to delete support thread'));
    }
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Support Messages</p>
        <h2>Track client messages and reply from the admin workspace.</h2>
        <p className="muted">New client messages stream in real time, with polling fallback if the stream drops.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="support-console">
        <aside className="card stack">
          <h3>Client threads</h3>
          {threads.map((thread) => (
            <div className="support-thread-row" key={thread.email}>
              <button
                className={selectedThread?.email === thread.email ? 'support-thread support-thread--active' : 'support-thread'}
                onClick={() => setSelectedEmail(thread.email)}
                type="button"
              >
                <span className="support-thread__title">
                  <strong>{thread.businessName}</strong>
                  {thread.needsReply && <span className="pill pill--warning">Needs reply</span>}
                </span>
                <span>{thread.email}</span>
                <small>{thread.latest?.body}</small>
              </button>
              <button
                aria-label={`Delete support thread for ${thread.email}`}
                className="icon-delete-button support-thread-delete"
                onClick={() => void deleteThread(thread.email)}
                type="button"
              >
                x
              </button>
            </div>
          ))}
          {!threads.length && <p className="muted">No support messages yet.</p>}
        </aside>

        <section className="card stack">
          {selectedThread ? (
            <>
              <div className="preview-header">
                <div>
                  <p className="eyebrow">Selected conversation</p>
                  <h3>{selectedThread.businessName}</h3>
                  <p className="muted">{selectedThread.email}</p>
                </div>
                <div className="pill-row">
                  {selectedThread.needsReply && <span className="pill pill--warning">Client waiting</span>}
                  <span className="pill">{selectedThread.messages.length} messages</span>
                </div>
              </div>

              <div className="support-message-list">
                {selectedThread.messages.map((message) => (
                  <article
                    className={message.sender === 'ADMIN' ? 'support-message support-message--admin' : 'support-message'}
                    key={message.id}
                  >
                    <div className="fix-list__header">
                      <strong>{message.sender === 'ADMIN' ? 'Nexoria' : selectedThread.businessName}</strong>
                      <span className="muted">{formatMessageTime(message.createdAt)}</span>
                    </div>
                    <p>{message.body}</p>
                  </article>
                ))}
              </div>

              <form className="stack-form" onSubmit={sendReply}>
                <label>
                  Reply
                  <textarea onChange={(event) => setReply(event.target.value)} rows={4} value={reply} />
                </label>
                <button className="primary-button" type="submit">
                  Send Reply
                </button>
              </form>
            </>
          ) : (
            <p className="muted">Select a client thread to reply.</p>
          )}
        </section>
      </div>
    </section>
  );
}
