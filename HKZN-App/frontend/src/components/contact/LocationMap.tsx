
import React from 'react';
// Removed MapComponent import

const LocationMap: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-fade-up animate-delay-200">
      <h2 className="text-2xl font-bold mb-6 text-hosting-dark-gray">Our Location</h2>
      <div className="rounded-lg overflow-hidden">
        {/* Replace MapComponent with Google Maps iframe */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.9673080123224!2d30.8814445!3d-30.3432778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ef6fb2b5d0d8b47%3A0x27e36d7f3a0d5c2a!2s485W%2BJQ%20Ramsgate%2C%20Margate!5e0!3m2!1sen!2sza!4v1689167545148!5m2!1sen!2sza"
          className="w-full h-80 md:h-96" // Adjusted height
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hosting KZN Location"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;
