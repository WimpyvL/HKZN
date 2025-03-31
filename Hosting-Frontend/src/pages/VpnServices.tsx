
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Shield, Globe, Lock, Users, RefreshCw, Laptop, Building, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const VpnServices: React.FC = () => {
  const benefits = [
    {
      title: 'Enhanced Security',
      description: 'Protect your sensitive data with military-grade encryption.',
      icon: <Shield size={36} />
    },
    {
      title: 'Global Access',
      description: 'Access resources worldwide without geographical restrictions.',
      icon: <Globe size={36} />
    },
    {
      title: 'Privacy Protection',
      description: 'Keep your online activities private and secure from third parties.',
      icon: <Lock size={36} />
    },
    {
      title: 'Multi-User Support',
      description: 'Solutions for individual users, teams, and entire organizations.',
      icon: <Users size={36} />
    }
  ];

  const solutions = [
    {
      title: 'Site-to-Site VPN',
      description: 'Connect multiple office locations securely as if they were on the same local network.',
      icon: <RefreshCw size={36} />
    },
    {
      title: 'Remote Access VPN',
      description: 'Provide secure access to your network for remote employees and travelers.',
      icon: <Laptop size={36} />
    },
    {
      title: 'Business VPN',
      description: 'Enterprise-grade solutions with advanced features and centralized management.',
      icon: <Building size={36} />
    },
    {
      title: 'Custom VPN Setup',
      description: 'Tailored solutions designed to meet your specific security requirements.',
      icon: <Settings size={36} />
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>VPN Services | Hosting KZN</title>
        <meta name="description" content="Secure, reliable VPN solutions for businesses and individuals to protect sensitive data and ensure private browsing." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">VPN Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Secure, reliable VPN solutions for businesses and individuals
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl font-bold mb-4 text-hosting-dark-gray">Why You Need a VPN</h2>
              <div className="w-16 h-1 bg-hosting-orange mb-6"></div>
              <p className="text-hosting-medium-gray mb-6">
                In today's digital landscape, cybersecurity is more important than ever. A Virtual Private Network (VPN) creates a secure, encrypted connection for your data, protecting it from hackers, surveillance, and other threats.
              </p>
              <p className="text-hosting-medium-gray mb-6">
                Our VPN solutions provide robust protection for your business communications, remote access capabilities, and data privacy—all managed with the highest levels of security and reliability.
              </p>
              <Button 
                asChild
                className="bg-hosting-orange text-white hover:bg-opacity-90"
              >
                <a href="/contact">Get Started</a>
              </Button>
            </div>
            
            <div className="animate-fade-up animate-delay-200 flex justify-center">
              <img 
                src="/lovable-uploads/f746fffe-b19c-46b7-89a9-73e322d85c7f.png" 
                alt="VPN Services" 
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Key Benefits</h2>
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

      {/* Solutions */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our VPN Solutions</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {solutions.map((solution, index) => (
              <ServiceCard
                key={solution.title}
                title={solution.title}
                description={solution.description}
                icon={solution.icon}
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
              Ready to Secure Your Digital Presence?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact us today to discuss which VPN solution is right for your business.
            </p>
            <Button 
              asChild
              variant="default" 
              className="bg-hosting-orange hover:bg-hosting-orange/90 text-white"
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VpnServices;
