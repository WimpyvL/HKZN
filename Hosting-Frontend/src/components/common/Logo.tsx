
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '/lovable-uploads/HKZNlogo.png'; // Import the image

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src={logoImage} // Use imported variable
        alt="Hosting KZN Logo" 
        className="h-10 w-auto" // Adjust height as needed
      />
    </Link>
  );
};

export default Logo;
