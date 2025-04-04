
import React from 'react';
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  name: string;
  email: string;
  contactNumber: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  name,
  email,
  contactNumber,
  handleChange
}) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="name" className="block text-hosting-dark-gray mb-2">Name:</label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hosting-orange"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-hosting-dark-gray mb-2">Email:</label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hosting-orange"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="contactNumber" className="block text-hosting-dark-gray mb-2">Contact Number:</label>
        <Input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={contactNumber}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hosting-orange"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
