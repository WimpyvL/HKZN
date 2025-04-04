
import React from 'react';
import { Button } from "@/components/ui/button";

interface ContactFormSubmitProps {
  isSubmitting: boolean;
}

const ContactFormSubmit: React.FC<ContactFormSubmitProps> = ({ isSubmitting }) => {
  return (
    <div className="text-center">
      <Button 
        type="submit" 
        className="bg-hosting-orange hover:bg-hosting-orange/90 text-white px-8"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
};

export default ContactFormSubmit;
