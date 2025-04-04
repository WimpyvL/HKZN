import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { PhoneCall, Wifi, DollarSign, Settings } from 'lucide-react'; // Example icons

const Voip: React.FC = () => {
  const features = [
    {
      title: 'Crystal Clear Calls',
      description: 'High-definition voice quality for professional communication.',
      icon: <PhoneCall size={36} />
    },
    {
      title: 'Cost Savings',
      description: 'Reduce your monthly phone bills significantly compared to traditional lines.',
      icon: <DollarSign size={36} />
    },
    {
      title: 'Scalability & Flexibility',
      description: 'Easily add or remove lines and features as your business grows or changes.',
      icon: <Settings size={36} />
    },
    {
      title: 'Advanced Features',
      description: 'Access features like call forwarding, voicemail-to-email, auto-attendant, and more.',
      icon: <Wifi size={36} /> // Re-using Wifi icon as an example
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>VoIP Solutions | Hosting KZN</title>
        <meta name="description" content="Modernize your business communication with reliable and cost-effective VoIP phone systems from Hosting KZN." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Business VoIP Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Affordable, reliable, and feature-rich voice communication for the modern workplace.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Our VoIP Services?</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          <p className="text-center text-hosting-medium-gray mt-4 mb-12 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            Our VoIP systems offer superior call quality, lower costs, and greater flexibility than traditional phone lines, backed by our expert setup and support.
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
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Significant reduction in communication costs.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Enhanced call quality and reliability.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Increased flexibility and mobility for your team.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Access to advanced calling features.</li>
            <li className="flex items-start justify-center"><span className="text-hosting-orange mr-2 mt-1">✓</span> Easy scalability as your business needs evolve.</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hosting-orange text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upgrade Your Business Communication?
            </h2>
            <p className="mb-8">
              Discover how our VoIP solutions can benefit your business. Contact us for a quote!
            </p>
            <Button
              asChild
              className="bg-white text-hosting-orange hover:bg-gray-100"
            >
              <a href="/contact">Request a Quote</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Voip;
