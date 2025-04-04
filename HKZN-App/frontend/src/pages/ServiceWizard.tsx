import React from 'react';
import Layout from '@/components/layout/Layout';
import Wizard from '@/components/wizard/Wizard';
import { Helmet } from 'react-helmet-async';

const ServiceWizardPage: React.FC = () => {
  return (
    <Layout>
       <Helmet>
        <title>Service Wizard | Host Africa</title>
        <meta name="description" content="Find the perfect hosting and web services for your needs with our guided wizard." />
      </Helmet>
      {/* Optional: Add a title or introductory section above the wizard if needed */}
      <Wizard />
    </Layout>
  );
};

export default ServiceWizardPage;
