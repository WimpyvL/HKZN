import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { Wrench, ShieldAlert, MonitorSmartphone, Clock } from 'lucide-react'; // Example icons

const ItSupport: React.FC = () => {
  const features = [
    {
      title: 'Remote & On-Site Support',
      description: 'Fast and reliable assistance both remotely and at your location.',
      icon: <Wrench size={36} />
    },
    {
      title: 'Proactive Monitoring',
      description: '24/7 system monitoring to prevent issues before they impact your business.',
      icon: <ShieldAlert size={36} />
    },
    {
      title: 'Hardware & Software Help',
      description: 'Support for desktops, laptops, servers, mobile devices, and software applications.',
      icon: <MonitorSmartphone size={36} />
    },
    {
      title: 'Managed IT Services',
      description: 'Comprehensive IT management plans tailored to your business needs and budget.',
      icon: <Clock size={36} /> // Re-using Clock icon
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>IT Support Services | Hosting KZN</title>
        <meta name="description" content="Reliable and responsive IT support services from Hosting KZN to keep your business technology running smoothly." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Expert IT Support Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Keep your business running smoothly with our responsive and reliable IT support.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Our IT Support?</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          <p className="text-center text-hosting-medium-gray mt-4 mb-12 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            We offer comprehensive IT support solutions, from troubleshooting everyday issues to proactive system maintenance, ensuring minimal downtime and maximum productivity.
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
          <ul className="mt-12 space-y-4 max-w-2xl mx-auto text-hosting-medium-gray animate-fade-up animate-delay-200">
            {/* Added justify-center */}
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Reduced IT downtime and faster issue resolution.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Improved system performance and reliability.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Access to experienced IT professionals.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Proactive maintenance to prevent future problems.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Scalable support plans to fit your budget.</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hosting-orange text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Reliable IT Support?
            </h2>
            <p className="mb-8">
              Let us handle your IT challenges so you can focus on your core business.
            </p>
            <Button
              asChild
              className="bg-white text-hosting-orange hover:bg-gray-100"
            >
              <a href="/contact">Contact Support Team</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ItSupport;
