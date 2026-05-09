'use client';
import { useAuth } from './components/AuthProvider';
import AuthPage from './components/AuthPage';
import AppShell from './components/AppShell';

export default function Home() {
  const { currentUser, userData, loading } = useAuth();

  //  loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-logo"> E-Split</div>
        <div className="loader-sub">Social Expense Sharing</div>
        <div className="loader-ring" />
      </div>
    );
  }

 //redirect if not authenticated, otherwise show app shell
  if (!currentUser || !userData) return <AuthPage />;
  return <AppShell />;
}
