
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-hosting-orange text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's build your digital future together. Get in touch today!
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              // Removed variant="outline" and changed classes
              className="bg-white text-hosting-orange hover:bg-gray-100" 
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            {/* Removed Explore Partnerships button */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
