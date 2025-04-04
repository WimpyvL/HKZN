
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Shield, Database, Lock, AlertTriangle, Monitor, Cloud, Network } from 'lucide-react';

const Security: React.FC = () => {
  const services = [
    {
      title: 'Network Security',
      description: 'Advanced firewall protection and network monitoring to keep your business safe from threats.',
      icon: <Shield size={36} />
    },
    {
      title: 'Data Protection',
      description: 'Robust encryption and data backup solutions to secure your sensitive information.',
      icon: <Database size={36} />
    },
    {
      title: 'Access Control',
      description: 'Multi-factor authentication and user access management systems.',
      icon: <Lock size={36} />
    },
    {
      title: 'Threat Prevention',
      description: 'Real-time threat detection and prevention with advanced malware protection.',
      icon: <AlertTriangle size={36} />
    }
  ];

  const solutions = [
    {
      title: 'Endpoint Security',
      features: [
        'Device Protection',
        'Application Control',
        'Remote Management',
        'Security Updates'
      ],
      icon: <Monitor size={36} />
    },
    {
      title: 'Cloud Security',
      features: [
        'Cloud Access Security',
        'Data Encryption',
        'Compliance Management',
        'Threat Monitoring'
      ],
      icon: <Cloud size={36} />
    },
    {
      title: 'Network Protection',
      features: [
        'Firewall Management',
        'VPN Solutions',
        'Intrusion Detection',
        'Traffic Analysis'
      ],
      icon: <Network size={36} />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Security Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Protect your digital assets with our comprehensive security solutions
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Security Services</h2>
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

      {/* Comprehensive Solutions */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Comprehensive Security Solutions</h2>
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

      {/* Kaspersky Partner Section */}
      <section className="py-16 bg-white"> {/* Added new section */}
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Protect Your Business with Kaspersky</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          <p className="text-center text-hosting-medium-gray mt-4 mb-8 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            As a Kaspersky Partner, we offer next-level cybersecurity that safeguards your business against evolving threats.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="animate-fade-up animate-delay-300">
              <h3 className="text-xl font-semibold mb-3 text-hosting-orange">Key Benefits:</h3>
              <ul className="space-y-2 text-hosting-medium-gray">
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Protects any device (Windows, Mac, iOS, Android)</li>
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Secures Microsoft Office 365 communication and collaboration</li>
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Combats evasive threats with EDR capabilities</li>
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Cloud-based solution for easy management and scalability</li>
              </ul>
            </div>
            <div className="animate-fade-up animate-delay-400">
              <h3 className="text-xl font-semibold mb-3 text-hosting-orange">Break Free from On-Premise Burden:</h3>
              <ul className="space-y-2 text-hosting-medium-gray">
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Hosted solution with web-based management</li>
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> No capital investment or 'patching Fridays'</li>
                <li className="flex items-start"><span className="text-hosting-orange mr-2 mt-1">✓</span> Pay-as-you-grow flexibility</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center max-w-3xl mx-auto text-hosting-medium-gray animate-fade-up animate-delay-500">
            <p className="mb-4">
              Kaspersky Endpoint Security Cloud provides comprehensive IT security, blocking ransomware, malware, and zero-day attacks. Our cloud-based approach ensures secure collaboration and device protection, anytime, anywhere.
            </p>
            <p>
              Get started quickly and easily, with no server setup or security policy configuration required. Focus on your business priorities while Kaspersky handles your IT security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protect Your Business Today
            </h2>
            <p className="text-gray-300 mb-8">
              Don't wait until it's too late. Secure your digital assets now.
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

export default Security;
