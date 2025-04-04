
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  containerClassName?: string;
  hoverEffect?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  className = '',
  containerClassName = '',
  hoverEffect = true,
}) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg p-6 flex flex-col items-center text-center card-shadow',
        hoverEffect && 'hover:-translate-y-1 transition-transform duration-300',
        containerClassName
      )}
    >
      <div className={cn(
        'text-hosting-orange mb-4',
        className
      )}>
        {icon}
      </div>
      <h3 className="text-hosting-dark-gray text-xl font-medium mb-2">{title}</h3>
      <p className="text-hosting-medium-gray text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
