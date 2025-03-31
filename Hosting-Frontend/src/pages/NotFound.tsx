
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <h1 className="text-7xl font-bold text-hosting-orange mb-6 animate-fade-up">404</h1>
          <h2 className="text-3xl font-semibold text-hosting-dark-gray mb-4 animate-fade-up animate-delay-100">
            Page Not Found
          </h2>
          <p className="text-hosting-medium-gray mb-8 animate-fade-up animate-delay-200">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="animate-fade-up animate-delay-300">
            <Button asChild size="lg" className="bg-hosting-orange hover:bg-hosting-orange/90 text-white">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
