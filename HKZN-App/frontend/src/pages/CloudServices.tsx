
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { HardDrive, RefreshCw, Shield, Server, DollarSign, Scale, LockKeyhole, CheckCircle2, Cloud, Database, Cpu, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CloudServices: React.FC = () => {
  const services = [
    {
      title: 'Cloud Storage',
      description: 'Secure and scalable storage solutions for your business data with easy access from anywhere.',
      icon: <HardDrive size={36} />
    },
    {
      title: 'Cloud Backup',
      description: 'Automated backup solutions ensuring your data is always protected and recoverable.',
      icon: <RefreshCw size={36} />
    },
    {
      title: 'Disaster Recovery',
      description: 'Custom solution design for business continuity. Maintain compliance and regulatory standards.',
      icon: <Shield size={36} />
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Scalable infrastructure solutions to support your growing business needs.',
      icon: <Server size={36} />
    }
  ];

  const benefits = [
    {
      title: 'Competitive Pricing',
      description: 'Enjoy cost-effective solutions with our consumption-based services and billing.',
      icon: <DollarSign size={36} />
    },
    {
      title: 'Scalable',
      description: 'Easily scale resources up or down based on your needs.',
      icon: <Scale size={36} />
    },
    {
      title: 'Secure',
      description: 'Enterprise-grade security protecting your data 24/7.',
      icon: <LockKeyhole size={36} />
    },
    {
      title: 'Reliable',
      description: '99.9% uptime guarantee with redundant systems.',
      icon: <CheckCircle2 size={36} />
    }
  ];

  const offerings = [
    {
      title: 'Microsoft Azure',
      description: 'Complete Azure solution implementation and management.',
      icon: <Cloud size={36} />
    },
    {
      title: 'AWS Services',
      description: 'Expert implementation of Amazon Web Services infrastructure.',
      icon: <Database size={36} />
    },
    {
      title: 'Google Cloud',
      description: 'Google Cloud Platform deployment and optimization.',
      icon: <Cpu size={36} />
    },
    {
      title: 'Managed Services',
      description: '24/7 monitoring and management of your cloud infrastructure.',
      icon: <Users size={36} />
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Cloud Services | Host Africa</title>
        <meta name="description" content="Empower your business with scalable, secure, and efficient cloud solutions from Host Africa." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Cloud Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Empower your business with scalable, secure, and efficient cloud solutions
          </p>
        </div>
      </section>

      {/* Cloud Solutions */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Cloud Solutions</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
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
          
          {/* Removed the div containing the two logos */}
        </div>
      </section>

      {/* Cloud Providers */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Cloud Providers We Support</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {offerings.map((offering, index) => (
              <ServiceCard
                key={offering.title}
                title={offering.title}
                description={offering.description}
                icon={offering.icon}
                className="animate-fade-up"
                containerClassName="h-full"
                hoverEffect={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Our Cloud Services?</h2>
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

      {/* CTA Section */}
      <section className="py-16 bg-hosting-orange text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your business with cloud solutions?
            </h2>
            <div className="mt-8">
              <Button 
                asChild
                // Removed variant="outline" and changed classes for visibility
                className="bg-white text-hosting-orange hover:bg-gray-100"
              >
                <a href="/contact">Contact Us Today</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CloudServices;
