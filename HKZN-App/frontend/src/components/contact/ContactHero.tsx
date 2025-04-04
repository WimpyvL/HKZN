
import React from 'react';
import ContactInfo from './ContactInfo';
import LocationMap from './LocationMap';

const ContactHero: React.FC = () => {
  return (
    <section className="relative bg-white pt-32 pb-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <ContactInfo />
          
          {/* Map */}
          <LocationMap />
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
