
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Sun, Battery, Zap, BarChart3, Home, Building, Wrench } from 'lucide-react';

const SolarSolutions: React.FC = () => {
  const services = [
    {
      title: 'Solar Installation',
      description: 'Professional installation of high-quality solar panels for optimal energy generation.',
      icon: <Sun size={36} />
    },
    {
      title: 'Battery Solutions',
      description: 'Advanced battery storage systems for reliable power backup and energy management.',
      icon: <Battery size={36} />
    },
    {
      title: 'Inverter Systems',
      description: 'High-performance inverters to convert solar power into usable electricity.',
      icon: <Zap size={36} />
    },
    {
      title: 'Energy Monitoring',
      description: 'Smart monitoring systems to track and optimize your energy consumption.',
      icon: <BarChart3 size={36} />
    }
  ];

  const solutions = [
    {
      title: 'Residential Solar',
      features: [
        'Home Solar Systems',
        'Battery Backup',
        'Smart Monitoring',
        'Energy Management'
      ],
      icon: <Home size={36} />
    },
    {
      title: 'Commercial Solar',
      features: [
        'Business Solar Systems',
        'Industrial Solutions',
        'Power Management',
        'Energy Storage'
      ],
      icon: <Building size={36} />
    },
    {
      title: 'Maintenance',
      features: [
        'Regular Inspections',
        'System Optimization',
        'Performance Monitoring',
        'Emergency Support'
      ],
      icon: <Wrench size={36} />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Solar Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Power your business with sustainable and reliable solar energy solutions
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Solar Services</h2>
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
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Solar Power Solutions</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {solutions.map((solution, index) => (
              <div 
                key={solution.title} 
                className="bg-white rounded-lg p-6 shadow-md animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="text-hosting-orange mb-4 flex justify-center">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{solution.title}</h3>
                <ul className="space-y-2">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-hosting-orange mr-2">✓</span>
                      <span className="text-hosting-medium-gray text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Go Solar?
            </h2>
            <p className="text-gray-300 mb-8">
              Take control of your energy future with our solar solutions.
            </p>
            <Button 
              asChild
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

export default SolarSolutions;
