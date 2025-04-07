
import React from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/common/ServiceCard';
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, Cog, Code, FileText, Bell, Mic, Users, Shield, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const EmailAutomation: React.FC = () => {
  const services = [
    {
      title: 'Email Marketing',
      description: 'Efficient lead-generation and follow-up campaigns with minimizing POPI violations.',
      icon: <Mail size={36} />
    },
    {
      title: 'SMS Marketing',
      description: 'Engage your audience directly through SMS marketing using the same platform as email marketing.',
      icon: <MessageSquare size={36} />
    },
    {
      title: 'Transactional Messaging',
      description: 'Send automated order confirmations, delivery notifications, OTPs, shipping reports, and system-based messages.',
      icon: <Send size={36} />
    },
    {
      title: 'Automation',
      description: 'Facilitate workflows and auto-respond to messages, simplifying lead nurturing and onboarding.',
      icon: <Cog size={36} />
    },
    {
      title: 'API Communicator',
      description: 'Offers a customizable method to streamline event integration and analytical capabilities.',
      icon: <Code size={36} />
    },
    {
      title: 'Landing Pages',
      description: 'Provide a simple page builder for quick creation of marketable, goal-oriented pages.',
      icon: <FileText size={36} />
    },
    {
      title: 'Push Notifications',
      description: 'Allows businesses to send messages to subscribers via a web browser.',
      icon: <Bell size={36} />
    },
    {
      title: 'Voice Broadcasting',
      description: "Enables sending recorded voice messages directly to subscribers' phones within minutes.",
      icon: <Mic size={36} />
    }
  ];

  const benefits = [
    {
      title: 'Higher Engagement Rates',
      description: 'Our platform consistently achieves open rates 20% higher than industry standards.',
      icon: <Users size={36} />
    },
    {
      title: 'POPI Compliant',
      description: 'All our email solutions are fully compliant with Protection of Personal Information Act requirements.',
      icon: <Shield size={36} />
    }
  ];

  const casestudies = [
    {
      company: 'TechCorp Solutions',
      results: 'Increased email open rates by 32% and conversion by 18% within 3 months',
      industry: 'Technology'
    },
    {
      company: 'Retail Giants',
      results: 'Automated welcome series resulted in 22% higher customer retention',
      industry: 'Retail'
    },
    {
      company: 'Financial Services Ltd',
      results: 'Reduced customer support inquiries by 45% through targeted automation',
      industry: 'Finance'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Email & Automation Solutions | Host Africa</title>
        <meta name="description" content="Streamline your business communications and workflows with intelligent automation solutions from Host Africa." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">Email & Automation Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Streamline your business communications and workflows with intelligent automation
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Email & Automation Services</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((service) => (
              <React.Fragment key={service.title}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  className="animate-fade-up"
                  containerClassName="h-full"
                  hoverEffect={true}
                />
                {/* Insert Everlytic section after Push Notifications card */}
                {service.title === 'Push Notifications' && (
                  <div className="flex flex-col items-center justify-center text-center p-6 animate-fade-up border border-gray-100 rounded-lg shadow-md bg-white h-full">
                     <p className="text-hosting-medium-gray mb-4 text-sm font-semibold">Email solutions powered by:</p>
                     <img
                       src="public/lovable-uploads/ceae3c51-ebc9-45b1-a7ab-38a172d8c679.png"
                       alt="Everlytic"
                       className="mx-auto h-12 object-contain"
                     />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Benefits of Our Email Solutions</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
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

      {/* Case Studies */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Success Stories</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {casestudies.map((study, index) => (
              <div key={study.company} className="bg-white rounded-lg p-6 shadow-md border border-gray-100 animate-fade-up">
                <h3 className="text-xl font-semibold mb-2">{study.company}</h3>
                <p className="text-hosting-medium-gray mb-4 text-sm">{study.industry} Industry</p>
                <p className="text-hosting-dark-gray">{study.results}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-hosting-orange inline-flex items-center text-sm font-medium">
                    Read Full Case Study <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hosting-dark-gray text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate Your Business?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact us today to discuss your email and automation needs.
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

export default EmailAutomation;
