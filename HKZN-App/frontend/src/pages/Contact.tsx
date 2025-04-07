
import React from 'react';
import Layout from '../components/layout/Layout';
import ContactHero from '../components/contact/ContactHero';
import ContactFormSection from '../components/contact/ContactFormSection';

const Contact: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section with Contact Info and Map */}
      <ContactHero />

      {/* Contact Form Section */}
      <ContactFormSection />
    </Layout>
  );
};

export default Contact;
