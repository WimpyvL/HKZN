
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Instagram } from 'lucide-react'; // Import Instagram icon
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const exploreLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/lovable-uploads/ca2b907c-14e4-41c4-b440-d5d94066ef4f.png" 
                alt="Hosting KZN" 
                className="h-12 object-contain"
              />
            </div>
            <p className="text-hosting-medium-gray mb-4 text-sm">
              Empowering your digital journey<br />
              with reliable, secure,<br />
              and innovative solutions.
            </p>
            {/* Legal links removed from here */}
          </div>

          {/* Explore Links - Added md:text-center for alignment */}
          <div className="md:text-center"> 
            <h3 className="text-lg font-medium mb-4 text-hosting-orange">Explore</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-hosting-dark-gray text-sm hover:text-hosting-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* Legal links added here */}
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-hosting-dark-gray text-sm hover:text-hosting-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us - Added md:text-right for alignment */}
          <div className="md:text-right"> 
            <h3 className="text-lg font-medium mb-4 text-hosting-dark-gray">Connect With Us</h3>
            <div className="flex space-x-4 md:justify-end"> {/* Added md:justify-end for the icon */}
              <a 
                href="https://www.facebook.com/hostingkzn.za" 
                className="bg-transparent border border-hosting-dark-gray text-hosting-dark-gray hover:bg-hosting-orange hover:border-hosting-orange hover:text-white p-2 rounded-full transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              {/* Add Instagram Icon */}
              <a 
                href="#" // Placeholder URL for Instagram
                className="bg-transparent border border-hosting-dark-gray text-hosting-dark-gray hover:bg-hosting-orange hover:border-hosting-orange hover:text-white p-2 rounded-full transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Removed Contact Us text block */}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-hosting-medium-gray">
          <p>© {currentYear} Hosting KZN. All rights reserved | Designed with <span className="text-hosting-orange">♥</span> by Hosting <span className="text-hosting-orange">KZN</span> Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
