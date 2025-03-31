import React, { useState, useCallback, useMemo } from 'react'; // Keep only this line
import { serviceCategories, ServiceOption, ServiceCategory, getCurrentCategory, formatCurrency } from '@/data/wizardServices';
import { Button } from '@/components/ui/button';
// Import step components
import WebsiteInfoStep from './steps/WebsiteInfoStep';
import UserInfoStep from './steps/UserInfoStep';
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import InvoiceStep from './steps/InvoiceStep';
// import ProgressBar from './ProgressBar'; // Keep commented for now

// Define state types
interface UserInfo {
  businessName?: string;
  contactPerson?: string; // This will be constructed from name/surname
  contactName?: string;   // Add field for first name
  contactSurname?: string;// Add field for surname
  email?: string;
  phone?: string;
  address?: string;
}

interface WebsiteInfo {
  websiteName?: string;
  domain?: string;
  template?: string;
}

interface SelectedServices {
  [categoryId: string]: ServiceOption | null;
}

const TOTAL_STEPS = 12; // 11 service steps + 1 invoice step (adjust if needed)

const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo>({});
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({});

  // --- Validation & Navigation Logic ---
  // TODO: Implement validation using react-hook-form + zod

  const handleNext = useCallback(() => {
    // Basic validation placeholders (replace with actual validation)
    if (currentStep === 1 && (!websiteInfo.websiteName || !websiteInfo.domain)) {
       alert('Please fill in Website Name and Domain.');
       return;
    }
     if (currentStep === 2 && (!userInfo.businessName || !userInfo.contactName || !userInfo.contactSurname || !userInfo.email || !userInfo.phone)) {
       alert('Please fill in all required contact fields.');
       return;
    }

    // Combine name and surname before potentially moving to next step or invoice
    const fullContactPerson = userInfo.contactName && userInfo.contactSurname
      ? `${userInfo.contactName} ${userInfo.contactSurname}`
      : undefined;

    const updatedUserInfo = { ...userInfo, contactPerson: fullContactPerson };
    setUserInfo(updatedUserInfo); // Update state if needed before invoice

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
    // Note: Invoice generation is implicitly handled by reaching TOTAL_STEPS
    // and the renderStepContent logic changing.
  }, [currentStep, websiteInfo, userInfo]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleServiceSelect = useCallback((categoryId: string, service: ServiceOption | null) => {
    setSelectedServices(prev => ({
      ...prev,
      [categoryId]: service,
    }));
    // Optionally auto-advance to next step? Original didn't seem to.
  }, []);

  const renderStepContent = () => {
    // Render the appropriate step component
    switch (currentStep) {
      case 1:
        return <WebsiteInfoStep data={websiteInfo} setData={setWebsiteInfo} />;
      case 2:
        return <UserInfoStep data={userInfo} setData={setUserInfo} />;
      default: {
        // Handle service selection steps (3-11)
        if (currentStep < TOTAL_STEPS) {
            const category = getCurrentCategory(currentStep);
            if (category) {
               return (
                 <ServiceSelectionStep
                   category={category}
                   selectedOption={selectedServices[category.id]}
                   onSelect={handleServiceSelect}
                 />
               );
            } else {
               return <div>Error: Invalid service step</div>; // Should not happen if TOTAL_STEPS is correct
            }
        }
        // Handle final invoice step (step 12)
        else if (currentStep === TOTAL_STEPS) {
             return <InvoiceStep userInfo={userInfo} websiteInfo={websiteInfo} selectedServices={selectedServices} />;
        }
        // Fallback for unexpected step number
        return <div>Unknown Step: {currentStep}</div>;
      }
    }
  };

  // Calculate totals for display (optional, could be done in InvoiceStep)
   const totals = useMemo(() => {
    let oneOff = 0;
    let monthly = 0;
    Object.values(selectedServices).forEach(service => {
      if (service) {
        oneOff += service.oneOffCost;
        monthly += service.monthlyCost;
      }
    });
    return { oneOff, monthly };
  }, [selectedServices]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      {/* Placeholder for Progress Bar */}
      {/* <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} /> */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-8 min-h-[400px] flex flex-col">
        <div className="flex-grow">
          {renderStepContent()}
        </div>
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>
          {/* Display totals (optional preview) */}
           {currentStep > 2 && currentStep < TOTAL_STEPS && (
             <div className="text-right text-sm text-gray-600">
               <p>Est. One-off: {formatCurrency(totals.oneOff)}</p>
               <p>Est. Monthly: {formatCurrency(totals.monthly)}</p>
             </div>
           )}
          <Button onClick={handleNext} disabled={currentStep === TOTAL_STEPS}> {/* Disable Next on Invoice */}
            {currentStep === TOTAL_STEPS - 1 ? 'Generate Quote' : 'Next'}
          </Button>
        </div>
      </div>
      {/* Debugging state */}
      {/* <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
        {JSON.stringify({ currentStep, websiteInfo, userInfo, selectedServices, totals }, null, 2)}
      </pre> */}
    </div>
  );
};

export default Wizard;
