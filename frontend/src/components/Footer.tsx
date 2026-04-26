import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Nexoria</strong>
        <p className="muted">Booked-job and deposit systems for blue-collar service businesses.</p>
      </div>
      <div className="footer__links">
        <a href="/#how-it-works">How it works</a>
        <a href="/#pricing">Pricing</a>
        <Link to="/faq">FAQ</Link>
        <a href="mailto:hello@nexoria.co">hello@nexoria.co</a>
      </div>
    </footer>
  );
}
