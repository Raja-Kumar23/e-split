'use client';
import { useAuth } from './components/AuthProvider';
import AuthPage from './components/AuthPage';
import AppShell from './components/AppShell';

export default function Home() {
  const { currentUser, userData, loading } = useAuth();

  // Show loading screen while verifying user authentication state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-logo"> E-Split</div>
        <div className="loader-sub">Social Expense Sharing</div>
        <div className="loader-ring" />
      </div>
    );
  }

  // Redirect to authentication if user is not logged in or data is missing
  if (!currentUser || !userData) return <AuthPage />;

  // Render the main application shell if authenticated
  return <AppShell />;
}
