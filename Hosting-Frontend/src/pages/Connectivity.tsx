
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Wifi, Radio, Network, Clock, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Connectivity: React.FC = () => {
  const services = [
    {
      title: 'Fibre Internet',
      description: 'High-speed fibre connectivity with guaranteed uptime and symmetric speeds, perfect for businesses of all sizes.',
      icon: <Wifi size={36} />
    },
    {
      title: 'Wireless Solutions',
      description: "Reliable wireless connectivity options for areas where fibre isn't available, ensuring you stay connected anywhere.",
      icon: <Radio size={36} />
    },
    {
      title: 'Business Internet',
      description: 'Dedicated business internet solutions with SLA-backed performance and priority support.',
      icon: <Network size={36} />
    }
  ];

  const benefits = [
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support to keep your business connected.',
      icon: <Clock size={36} />
    },
    {
      title: '99.9% Uptime',
      description: 'Guaranteed network reliability you can count on.',
      icon: <CheckCircle2 size={36} />
    },
    {
      title: 'Flexible Options',
      description: 'Customizable bandwidth solutions for your needs.',
      icon: <Sliders size={36} />
    },
    {
      title: 'Network Monitoring',
      description: 'Proactive monitoring and maintenance.',
      icon: <Shield size={36} />
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Connectivity Solutions | Hosting KZN</title>
        <meta name="description" content="High-speed fiber and wireless connectivity solutions for your business and home needs." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Connectivity Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Stay connected with our premium internet solutions tailored for your business
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Connectivity Solutions</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                className="animate-fade-up"
                containerClassName="h-full"
                hoverEffect={true}
              />
            ))}
          </div>
          
          {/* Removed the div containing the Vox and Fiber logos */}
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Our Connectivity Services?</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <ServiceCard
                key={benefit.title}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                className="animate-fade-up"
                containerClassName="h-full"
                hoverEffect={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Connected?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact us today to discuss your connectivity needs and find the perfect solution for your business.
            </p>
            <Button 
              asChild
              variant="default" 
              className="bg-hosting-orange hover:bg-hosting-orange/90 text-white"
            >
              <a href="/contact">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Connectivity;
