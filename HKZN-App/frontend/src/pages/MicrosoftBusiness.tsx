import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { Briefcase, Cloud, Users, ShieldCheck } from 'lucide-react'; // Example icons

const MicrosoftBusiness: React.FC = () => {
  const features = [
    {
      title: 'Microsoft 365 Suite',
      description: 'Boost productivity with essential tools like Word, Excel, Teams, and Outlook.',
      icon: <Briefcase size={36} />
    },
    {
      title: 'Azure Cloud Solutions',
      description: 'Leverage Microsoft\'s powerful cloud platform for scalability and innovation.',
      icon: <Cloud size={36} />
    },
    {
      title: 'Enhanced Collaboration',
      description: 'Improve teamwork with SharePoint, Teams, and OneDrive integration.',
      icon: <Users size={36} />
    },
    {
      title: 'Advanced Security',
      description: 'Protect your business data with Microsoft\'s robust security features.',
      icon: <ShieldCheck size={36} />
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Microsoft Business Solutions | Hosting KZN</title>
        <meta name="description" content="Empower your business with Microsoft 365, Azure, and other essential Microsoft solutions tailored by Hosting KZN." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Microsoft Business Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Unlock productivity and collaboration with tailored Microsoft solutions for your business.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Our Microsoft Services?</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          <p className="text-center text-hosting-medium-gray mt-4 mb-12 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            We provide expert setup, migration, management, and support for Microsoft 365 and Azure, ensuring seamless integration and optimal performance for your specific business needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ServiceCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className="animate-fade-up"
                containerClassName="h-full"
                hoverEffect={true}
                // Removed style prop - animation delay might need a different approach if required
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Key Benefits</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          {/* Removed text-center from ul */}
          <ul className="mt-12 space-y-4 max-w-2xl mx-auto text-hosting-medium-gray animate-fade-up animate-delay-200">
            {/* Added justify-center to center the content within the li */}
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Streamlined workflows and communication.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Scalable cloud infrastructure with Azure.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Access to the latest Microsoft applications.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Robust security and compliance features.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Expert support and management from our team.</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hosting-orange text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to leverage Microsoft for your business?
            </h2>
            <p className="mb-8">
              Contact us today for a consultation on how Microsoft solutions can drive your success.
            </p>
            <Button
              asChild
              className="bg-white text-hosting-orange hover:bg-gray-100"
            >
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MicrosoftBusiness;
