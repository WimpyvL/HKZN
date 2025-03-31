
import React from 'react';
import Layout from '../components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';

const AboutUs: React.FC = () => {
  const team = [
    {
      name: 'Wessel Pretorius',
      role: 'Marketing',
      image: '/lovable-uploads/e32d919f-c714-418e-91f8-15507f80df99.png'
    },
    {
      name: 'Marilize Pretorius',
      role: 'Administration',
      image: '/lovable-uploads/2f42b785-50e7-4ce9-b084-e52af428d856.png'
    },
    {
      name: 'Wimpie van Loggerenberg',
      role: 'Technical Lead',
      image: '/lovable-uploads/77c7afac-9352-4d24-8b0b-97201b2096e3.png'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>About Us | Hosting KZN</title>
        <meta name="description" content="Learn about Hosting KZN's journey, mission, vision, and the team behind our successful hosting and IT solutions." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-hosting-dark-gray pt-32 pb-16 text-white text-center">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">About Hosting KZN</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-up animate-delay-100">
            Empowering Digital Excellence Through Innovation & Trust
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-lg p-8 shadow-md animate-fade-up">
              <h2 className="text-2xl font-bold mb-4 text-hosting-orange">Our Mission</h2>
              <div className="w-16 h-1 bg-hosting-orange mb-6"></div>
              <p className="text-hosting-medium-gray">
                At Hosting KZN, we're dedicated to delivering cutting-edge digital solutions that transform businesses. Our customer-centric approach combines modern technology with reliability and innovation. From web design to robust hosting and connectivity, we're passionate about driving growth and fostering a sustainable digital future.
              </p>
            </div>
            
            {/* Vision */}
            <div className="bg-white rounded-lg p-8 shadow-md animate-fade-up animate-delay-200">
              <h2 className="text-2xl font-bold mb-4 text-hosting-orange">Our Vision</h2>
              <div className="w-16 h-1 bg-hosting-orange mb-6"></div>
              <p className="text-hosting-medium-gray">
                We envision a future where technology drives positive change. Our goal is to help businesses thrive by leveraging modern solutions that boost productivity, support innovation, and build a sustainable foundation. We aim to make technology understandable and accessible to everyone, transforming the way companies work and grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 bg-hosting-light-gray">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Journey</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="max-w-3xl mx-auto mt-12">
            <div className="text-center mb-8">
              <img 
                src="/lovable-uploads/d44f5e5f-7225-4c1d-8aa1-a0bf4cc77219.png" 
                alt="Our Community" 
                className="mx-auto w-32 h-32 object-contain"
              />
            </div>
            <p className="text-center text-hosting-medium-gray mb-8 animate-fade-up animate-delay-200">
              Founded in 2007, Hosting KZN started with a simple but ambitious idea: to help businesses leverage technology to drive progress. From our beginnings as a small hosting provider, we have grown into a leading service provider in South Africa and abroad.
            </p>
            <p className="text-center text-hosting-medium-gray mb-8 animate-fade-up animate-delay-300">
              We've expanded our services to include cloud solutions, connectivity, automation, and even solar solutions to help our clients achieve their goals sustainably. Our journey has always been about making a difference to our clients, and we're proud to be a company that puts people first, values transparency, and strives for constant innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading animate-fade-up">Our Leadership Team</h2>
          <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {team.map((member, index) => (
              <div 
                key={member.name} 
                className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-lg object-cover mb-4"
                />
                <h3 className="text-hosting-dark-gray text-xl font-medium">{member.name}</h3>
                <p className="text-hosting-medium-gray">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hosting-orange text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to partner with us for your digital success?
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

export default AboutUs;
