
import React from 'react';
import ContactForm from './ContactForm';
import { Toaster } from "@/components/ui/toaster";

const ContactFormSection: React.FC = () => {
  return (
    <section className="py-16 bg-hosting-light-gray">
      <div className="container-custom">
        <ContactForm />
        <Toaster />
      </div>
    </section>
  );
};

export default ContactFormSection;
