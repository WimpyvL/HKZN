import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming template might be a textarea

// Define props type matching the state slice in Wizard.tsx
interface WebsiteInfo {
  websiteName?: string;
  domain?: string;
  template?: string; // Or maybe preferred style/features?
}

interface WebsiteInfoStepProps {
  data: WebsiteInfo;
  setData: React.Dispatch<React.SetStateAction<WebsiteInfo>>;
  // Add props for react-hook-form later (register, errors)
}

const WebsiteInfoStep: React.FC<WebsiteInfoStepProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // TODO: Integrate react-hook-form for validation

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Website Information</h2>
        <p className="text-gray-600">Tell us about your website requirements</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="websiteName">Website/Business Name*</Label>
          <Input
            id="websiteName"
            name="websiteName"
            value={data.websiteName || ''}
            onChange={handleChange}
            placeholder="e.g., My Awesome Business"
            required
            // Add react-hook-form register later
          />
          {/* Add error display later */}
        </div>
        <div>
          <Label htmlFor="domain">Preferred Domain Name*</Label>
          <Input
            id="domain"
            name="domain"
            value={data.domain || ''}
            onChange={handleChange}
            placeholder="e.g., myawesomebusiness.co.za"
            required
            // Add react-hook-form register later
          />
           {/* Add domain checker logic/UI later */}
          {/* Add error display later */}
        </div>
         <div>
          <Label htmlFor="template">Website Style/Template Preference (Optional)</Label>
          <Textarea
            id="template"
            name="template"
            value={data.template || ''}
            onChange={handleChange}
            placeholder="Describe the look and feel you want, or provide links to examples."
            rows={3}
            // Add react-hook-form register later
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteInfoStep;
