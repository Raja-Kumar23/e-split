import './globals.css';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './components/AuthProvider';

export const metadata = {
  title: 'E-Split — Social Expense Sharing',
  description: 'Split bills, track expenses and settle debts with friends',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
