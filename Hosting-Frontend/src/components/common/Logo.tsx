
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  // Construct the image source using the base URL
  const logoSrc = `${import.meta.env.BASE_URL}lovable-uploads/HKZNlogo.png`;

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Hosting KZN Logo" 
        className="h-10 w-auto" // Adjust height as needed
      />
    </Link>
  );
};

export default Logo;
