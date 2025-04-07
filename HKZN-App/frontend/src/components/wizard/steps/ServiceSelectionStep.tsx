import React from 'react';
import { ServiceCategory, ServiceOption } from '@/data/wizardServices';
import WizardServiceCard from '../WizardServiceCard';

interface ServiceSelectionStepProps {
  category: ServiceCategory;
  selectedOption: ServiceOption | null | undefined; // Can be null or undefined if nothing selected yet
  onSelect: (categoryId: string, service: ServiceOption) => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ category, selectedOption, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
        <p className="text-gray-600">{category.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.options.map((option) => (
          <WizardServiceCard
            key={option.name}
            service={option}
            isSelected={selectedOption?.name === option.name}
            onSelect={(service) => onSelect(category.id, service)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
