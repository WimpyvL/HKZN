
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, ShoppingCart, Search, Palette, BarChart } from 'lucide-react';

const WebDesign: React.FC = () => {
  const services = [
    {
      title: 'Custom Website Design',
      description: 'Unique, creative websites tailored to your business needs and goals.',
      icon: <Monitor size={36} />
    },
    {
      title: 'Responsive Design',
      description: 'Websites that look and function perfectly on all devices and screen sizes.',
      icon: <Smartphone size={36} />
    },
    {
      title: 'E-commerce Solutions',
      description: 'Custom online stores with secure payment integration and inventory management.',
      icon: <ShoppingCart size={36} />
    },
    {
      title: 'SEO Optimization',
      description: 'Built-in SEO best practices to help your website rank better in search results.',
      icon: <Search size={36} />
    },
    {
      title: 'Branding and Identity',
      description: 'Developing unique brand identities that reflect your business values and mission.',
      icon: <Palette size={36} />
    },
    {
      title: 'Analytics and Performance',
      description: 'Tracking website performance and providing data-driven insights to improve conversion rates.',
      icon: <BarChart size={36} />
    }
  ];

  const designProcess = [
    {
      step: 1,
      title: 'Discovery',
      description: 'We learn about your business, goals, and target audience'
    },
    {
      step: 2,
      title: 'Planning',
      description: 'Creating wireframes and planning site architecture'
    },
    {
      step: 3,
      title: 'Design',
      description: 'Developing visual designs and user interfaces'
    },
    {
      step: 4,
      title: 'Development',
      description: 'Building your website with clean, efficient code'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Web Design Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Creating stunning, responsive websites that drive results
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Web Design Services</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-heading animate-fade-up">Ready to Unlock Your Dream Website?</h2>
            <p className="text-hosting-medium-gray mb-8 animate-fade-up animate-delay-100">
              Use our Service Wizard to discover the perfect web design solution for your business
            </p>
            <div className="animate-fade-up animate-delay-200">
              <Button className="bg-hosting-orange text-white hover:bg-opacity-90">
                Use Our Service Wizard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Design Process</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {designProcess.map((step) => (
              <div key={step.step} className="text-center animate-fade-up">
                <div className="bg-hosting-orange text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-hosting-medium-gray text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Web Design Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact us today for a free consultation and quote
            </p>
            <Button 
              asChild 
              className="bg-hosting-orange text-white hover:bg-opacity-90"
            >
              <a href="/contact">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebDesign;
