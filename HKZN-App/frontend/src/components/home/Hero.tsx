
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    // Simple parallax effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (element) {
        element.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative w-full flex items-center justify-center overflow-hidden bg-gray-100 py-24"
      style={{
        background: 'linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)), url(/lovable-uploads/96118922-4731-4dcc-a501-91620d979f63.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container-custom z-10 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-hosting-dark-gray mb-6 animate-fade-up">
            <span className="block">READY TO</span> 
            <span className="text-hosting-orange">GO</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-hosting-dark-gray mb-8 animate-fade-up animate-delay-200">
            ONLINE
          </h2>
          <p className="text-xl text-hosting-medium-gray mb-8 max-w-xl mx-auto animate-fade-up animate-delay-300">
            Elevate your digital presence with our comprehensive range of web services
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up animate-delay-400">
            <Button asChild className="bg-hosting-orange text-white hover:bg-opacity-90 px-6 py-3 rounded-md font-medium">
              <Link to="/services">Explore Our Services</Link>
            </Button>
            <Button asChild variant="outline" className="border-hosting-dark-gray text-hosting-dark-gray hover:bg-hosting-dark-gray hover:text-white px-6 py-3 rounded-md font-medium">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild className="bg-hosting-dark-gray text-white hover:bg-opacity-90 px-6 py-3 rounded-md font-medium">
              <Link to="/our-partners">Our Partners</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
