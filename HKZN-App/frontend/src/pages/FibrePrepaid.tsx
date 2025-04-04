
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Sliders, Clock, AlertTriangle, Wifi, PiggyBank, BarChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const FibrePrepaid: React.FC = () => {
  const benefits = [
    {
      title: 'No Contracts',
      description: 'Enjoy the freedom of no long-term commitments or credit checks.',
      icon: <CreditCard size={36} />
    },
    {
      title: 'High-Speed',
      description: 'Experience lightning-fast internet speeds.',
      icon: <Zap size={36} />
    },
    {
      title: 'Flexible Plans',
      description: 'Choose from top-up packages that suit your needs.',
      icon: <Sliders size={36} />
    },
    {
      title: 'Instant Activation',
      description: 'Get connected immediately after topping up your account.',
      icon: <Clock size={36} />
    },
    {
      title: 'Subject to Availability',
      description: 'Please note that prepaid fibre services are only available in select areas. Check our coverage checker to see if fibre is available in your area.',
      icon: <AlertTriangle size={36} />
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Check Coverage',
      description: 'Verify if fibre is available in your area using our coverage checker.'
    },
    {
      step: 2,
      title: 'Choose Package',
      description: 'Select the prepaid package that best suits your needs.'
    },
    {
      step: 3,
      title: 'Get Connected',
      description: "We'll install your fibre connection and provide your router."
    },
    {
      step: 4,
      title: 'Top Up & Enjoy',
      description: 'Load credit and start enjoying high-speed internet instantly.'
    }
  ];

  const packages = [
    {
      title: 'Basic',
      speed: '25 Mbps',
      price: 'R299',
      data: '100GB',
      icon: <Wifi size={36} />
    },
    {
      title: 'Standard',
      speed: '50 Mbps',
      price: 'R499',
      data: '250GB',
      icon: <Wifi size={36} />
    },
    {
      title: 'Premium',
      speed: '100 Mbps',
      price: 'R749',
      data: '500GB',
      icon: <Wifi size={36} />
    }
  ];

  const additionalInfo = [
    {
      title: 'Cost Effective',
      description: 'Pay only for what you need with no surprise bills at the end of the month.',
      icon: <PiggyBank size={36} />
    },
    {
      title: 'Usage Monitoring',
      description: 'Track your data usage in real-time through our user-friendly dashboard.',
      icon: <BarChart size={36} />
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Fibre Prepaid Services | Host Africa</title>
        <meta name="description" content="Flexible, high-speed internet without long-term commitments. Pay-as-you-go fibre internet solutions from Host Africa." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Fibre Prepaid Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Flexible, high-speed internet without long-term commitments
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Why Choose Prepaid Fibre?</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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

      {/* Packages */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <h2 className="section-heading text-white animate-fade-up">Popular Packages</h2>
          <div className="section-heading-divider bg-white animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {packages.map((pkg, index) => (
              <div key={pkg.title} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all duration-300 animate-fade-up">
                <div className="text-hosting-orange mb-4 flex justify-center">
                  {pkg.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-3xl font-bold text-hosting-orange mb-2">{pkg.price}</p>
                <div className="text-gray-300 mb-6">
                  <p className="mb-1">{pkg.speed} Download/Upload</p>
                  <p>{pkg.data}</p>
                </div>
                <Button className="bg-hosting-orange hover:bg-opacity-90 w-full">
                  Select Package
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">How It Works</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {steps.map((step) => (
              <div key={step.step} className="bg-white rounded-lg p-6 text-center shadow-md animate-fade-up">
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

      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Additional Benefits</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {additionalInfo.map((info, index) => (
              <ServiceCard
                key={info.title}
                title={info.title}
                description={info.description}
                icon={info.icon}
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
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8">
              Experience the freedom of prepaid fibre internet today.
            </p>
            <Button 
              asChild
              variant="default" 
              className="bg-hosting-orange hover:bg-hosting-orange/90 text-white"
            >
              <a href="/contact">Check Coverage</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FibrePrepaid;
