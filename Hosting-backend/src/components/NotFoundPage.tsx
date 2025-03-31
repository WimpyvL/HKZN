import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store'; // To determine redirect link

const NotFoundPage: React.FC = () => {
  const { currentUser } = useStore();

  // Determine the correct dashboard link based on user role
  const dashboardLink = currentUser?.role === 'agent' ? '/agent' : '/admin';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Sorry, the page you requested could not be found within the dashboard.
      </p>
      <Button asChild>
        <Link to={dashboardLink}>Go Back to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
