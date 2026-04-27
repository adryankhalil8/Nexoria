import { Link } from 'react-router-dom';

const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

export default function PublicHomeLink() {
  return (
    <Link aria-label="Go to homepage" className="public-home-link" to="/">
      <img alt="Nexoria" src={logoImage} />
    </Link>
  );
}
