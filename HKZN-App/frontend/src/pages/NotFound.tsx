import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout'; // Assuming Layout provides header/footer
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4"> {/* Adjust min-height based on header/footer */}
        <AlertTriangle className="w-16 h-16 text-hosting-orange mb-4" />
        <h1 className="text-4xl md:text-6xl font-bold text-hosting-dark-gray mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-hosting-medium-gray mb-4">Page Not Found</h2>
        <p className="text-hosting-medium-gray mb-8 max-w-md">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
