
import React from 'react';
import PersonalInfoFields from './PersonalInfoFields';
import ServicesCheckboxes from './ServicesCheckboxes';
import MessageField from './MessageField';
import ContactFormSubmit from './ContactFormSubmit';
import { useContactForm } from '@/hooks/use-contact-form';

const ContactForm: React.FC = () => {
  const { 
    formData, 
    isSubmitting, 
    handleChange, 
    handleCheckboxChange, 
    handleSubmit 
  } = useContactForm();

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md animate-fade-up">
      <h2 className="text-2xl font-bold mb-6 text-hosting-orange text-center">Contact Us Today</h2>
      
      <form onSubmit={handleSubmit}>
        <PersonalInfoFields
          name={formData.name}
          email={formData.email}
          contactNumber={formData.contactNumber}
          handleChange={handleChange}
        />
        
        <ServicesCheckboxes
          services={formData.services}
          handleCheckboxChange={handleCheckboxChange}
        />
        
        <MessageField
          message={formData.message}
          handleChange={handleChange}
        />

        {/* Add reCAPTCHA element */}
        <div className="my-4 flex justify-center">
            <div className="g-recaptcha" data-sitekey="6LcvqsAqAAAAACMHaS7A_sLHZVSEaM5x626GVKLT"></div>
            {/* TODO: Add state and handler to get reCAPTCHA response token */}
            {/* TODO: Send token to backend for verification */}
        </div>

        <ContactFormSubmit isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ContactForm;
