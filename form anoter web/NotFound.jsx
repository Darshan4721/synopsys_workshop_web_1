import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="bg-overlay" />
      <div className="notfound-container">
        <GlassCard className="notfound-card">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p className="text-secondary-p">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <div className="notfound-actions">
            <Link to="/">
              <PrimaryButton>Return Home</PrimaryButton>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
