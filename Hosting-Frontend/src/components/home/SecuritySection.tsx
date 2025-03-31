
import React from 'react';
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Lock, Eye, Server, FileCheck, Users, CheckCircle2, ArrowRight } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Advanced Firewall Protection",
      description: "Multi-layered firewall systems to block malicious traffic"
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Data Encryption",
      description: "End-to-end encryption for all sensitive information"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "24/7 Monitoring",
      description: "Continuous surveillance of your digital infrastructure"
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: "Secure Hosting",
      description: "Protected servers with regular security updates"
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: "Compliance Management",
      description: "Ensure adherence to industry regulations"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Security Training",
      description: "Employee awareness programs to prevent breaches"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="relative">
              <img 
                src="public/lovable-uploads/1618c6a8-2676-4ce0-9e99-7d65f17477f7.png" 
                alt="Security Services" 
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                {securityFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-hosting-light-gray p-4 rounded-lg flex items-start transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1"
                  >
                    <div className="bg-hosting-orange p-2 rounded-full text-white mr-3 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-hosting-dark-gray text-sm mb-1">{feature.title}</h4>
                      <p className="text-hosting-medium-gray text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="animate-fade-up animate-delay-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Securing Your Digital World<br />
              <span className="text-hosting-orange">with Expertise</span>
            </h2>
            <div className="w-16 h-1 bg-hosting-orange mb-6"></div>
            <p className="text-hosting-medium-gray mb-6">
              HOSTING KZN is dedicated to delivering world-class online security solutions. From our humble beginnings, we have evolved into a trusted partner for numerous businesses, thanks to our commitment to safeguarding digital assets, our expert team, and our client-focused approach.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle2 className="text-hosting-orange mr-2 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-hosting-orange font-medium">Customer Trust:</span>
                  <span className="ml-2 text-hosting-medium-gray">We prioritize the security of our clients' data with industry-leading protocols and regular security audits to ensure maximum protection.</span>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-hosting-orange mr-2 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-hosting-orange font-medium">Years of Experience:</span>
                  <span className="ml-2 text-hosting-medium-gray">Our team includes certified security professionals with extensive experience in threat detection, prevention, and remediation strategies.</span>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-hosting-orange mr-2 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-hosting-orange font-medium">Local Expertise:</span>
                  <span className="ml-2 text-hosting-medium-gray">Our deep understanding of the KZN region allows us to address location-specific security challenges with customized solutions.</span>
                </div>
              </li>
            </ul>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button asChild className="bg-hosting-orange text-white hover:bg-opacity-90 px-6 py-3 rounded-md font-medium">
                  <a href="/security">LEARN MORE</a>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-white text-hosting-dark-gray">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-hosting-orange">Security Statistics</h3>
                  <ul className="space-y-2 text-sm text-hosting-medium-gray">
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-hosting-orange mr-2" />
                      <span>60% of small businesses close within 6 months of a cyber attack</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-hosting-orange mr-2" />
                      <span>Our clients report 95% fewer security incidents</span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-hosting-orange mr-2" />
                      <span>24/7 monitoring with 15-minute response time</span>
                    </li>
                  </ul>
                  <p className="text-hosting-dark-gray font-medium mt-2">Protect your business now!</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
