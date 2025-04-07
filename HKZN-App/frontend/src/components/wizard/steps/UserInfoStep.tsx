import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Define props type matching the state slice in Wizard.tsx
interface UserInfo {
  businessName?: string;
  contactPerson?: string; // Combined name+surname in original, split here for better form structure
  contactName?: string;
  contactSurname?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UserInfoStepProps {
  data: UserInfo;
  setData: React.Dispatch<React.SetStateAction<UserInfo>>;
  // Add props for react-hook-form later (register, errors)
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // TODO: Integrate react-hook-form for validation

  return (
    <div className="space-y-6">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p className="text-gray-600">Please provide your contact details.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name*</Label>
          <Input
            id="businessName"
            name="businessName"
            value={data.businessName || ''}
            onChange={handleChange}
            placeholder="Your Company (Pty) Ltd"
            required
            // register={register}
          />
          {/* errors.businessName && <span className="text-red-500 text-sm">This field is required</span> */}
        </div>
        <div> {/* Placeholder for spacing */} </div>
        <div>
          <Label htmlFor="contactName">Contact Name*</Label>
          <Input
            id="contactName"
            name="contactName"
            value={data.contactName || ''}
            onChange={handleChange}
            placeholder="John"
            required
            // register={register}
          />
          {/* errors.contactName && <span className="text-red-500 text-sm">This field is required</span> */}
        </div>
        <div>
          <Label htmlFor="contactSurname">Contact Surname*</Label>
          <Input
            id="contactSurname"
            name="contactSurname"
            value={data.contactSurname || ''}
            onChange={handleChange}
            placeholder="Doe"
            required
            // register={register}
          />
          {/* errors.contactSurname && <span className="text-red-500 text-sm">This field is required</span> */}
        </div>
        <div>
          <Label htmlFor="email">Email Address*</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={data.email || ''}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
            // register={register}
          />
          {/* errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span> */}
        </div>
        <div>
          <Label htmlFor="phone">Business Phone*</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={data.phone || ''}
            onChange={handleChange}
            placeholder="031 123 4567"
            required
            // register={register}
          />
          {/* errors.phone && <span className="text-red-500 text-sm">This field is required</span> */}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Physical Address (Optional)</Label>
          <Textarea
            id="address"
            name="address"
            value={data.address || ''}
            onChange={handleChange}
            placeholder="123 Main Street, Durban, 4001"
            rows={3}
            // register={register}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoStep;
