
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md animate-fade-up">
      <h2 className="text-2xl font-bold mb-6 text-hosting-orange">Reach Us On</h2>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="text-hosting-orange mr-4">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-medium text-hosting-orange mb-1">ADDRESS</h3>
            <p className="text-hosting-medium-gray">28 Fascadale Heights, Marine Dr, Ramsgate, 4285</p> {/* Corrected typo */}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-hosting-orange mr-4">
            <Phone size={24} />
          </div>
          <div>
            <h3 className="font-medium text-hosting-orange mb-1">TELEPHONE</h3>
            <p className="text-hosting-medium-gray">Office: 087 188 6697 / 087 153 2643</p>
            <p className="text-hosting-medium-gray">Mobile: 082 777 0331 / 082 318 6195</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-hosting-orange mr-4">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-medium text-hosting-orange mb-1">E-MAIL</h3>
            <p className="text-hosting-medium-gray">info@hostingkzn.com</p> {/* Corrected domain */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
