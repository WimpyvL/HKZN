
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ServicesCheckboxesProps {
  services: {
    webDevelopment: boolean;
    appDevelopment: boolean;
    fibreLte: boolean;
    securitySolutions: boolean;
    solarSolutions: boolean;
    aiIntegration: boolean;
  };
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ServicesCheckboxes: React.FC<ServicesCheckboxesProps> = ({
  services,
  handleCheckboxChange
}) => {
  const serviceOptions = [
    { id: 'webDevelopment', label: 'Web Development' },
    { id: 'appDevelopment', label: 'App Development' },
    { id: 'fibreLte', label: 'Fibre/LTE' },
    { id: 'securitySolutions', label: 'Security Solutions' },
    { id: 'solarSolutions', label: 'Solar Solutions' },
    { id: 'aiIntegration', label: 'AI Integration' },
  ];

  return (
    <div className="mb-4">
      <label className="block text-hosting-dark-gray mb-2">Select Services:</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {serviceOptions.map((service) => (
          <div key={service.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={service.id}
              name={service.id}
              checked={services[service.id as keyof typeof services]}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4 text-hosting-orange focus:ring-hosting-orange"
            />
            <Label htmlFor={service.id} className="text-hosting-medium-gray">
              {service.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCheckboxes;
