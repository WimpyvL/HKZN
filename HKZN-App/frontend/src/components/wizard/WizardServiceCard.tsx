import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { ServiceOption, formatCurrency } from '@/data/wizardServices';
import { cn } from '@/lib/utils'; // Assuming you have this utility for classnames

interface WizardServiceCardProps {
  service: ServiceOption;
  isSelected: boolean;
  onSelect: (service: ServiceOption) => void;
}

const WizardServiceCard: React.FC<WizardServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <Card className={cn(
      "flex flex-col h-full transition-all border-2",
      isSelected ? "border-hosting-orange shadow-lg" : "border-gray-200 hover:shadow-md"
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {service.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-4 border-t mt-auto">
         <div className="text-sm text-gray-800 mb-3 w-full">
            {service.oneOffCost > 0 && (
                 <p>One-off: <span className="font-semibold">{formatCurrency(service.oneOffCost)}</span></p>
            )}
             {service.monthlyCost > 0 && (
                 <p>Monthly: <span className="font-semibold">{formatCurrency(service.monthlyCost)}</span></p>
            )}
         </div>
        <Button
          onClick={() => onSelect(service)}
          variant={isSelected ? "default" : "outline"}
          className={cn("w-full", isSelected && "bg-hosting-orange hover:bg-hosting-orange/90")}
        >
          {isSelected ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WizardServiceCard;
