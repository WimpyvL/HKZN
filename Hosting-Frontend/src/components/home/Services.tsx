import React from 'react';
import ServiceCard from '../common/ServiceCard';
// Added Briefcase, PhoneCall, Wrench icons
import { Monitor, WifiIcon, Mail, Server, Shield, Sun, Globe, ArrowRight, Briefcase, PhoneCall, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Import images
import webDesignIcon from '/lovable-uploads/6b0744f0-7466-4815-9a73-7662a74d74d9.png';
import connectivityIcon from '/lovable-uploads/1dee1658-e5a9-4d52-8a0a-1b71f85fdd73.png';
import emailIcon from '/lovable-uploads/5dbc5e7e-9dcd-4df6-a2da-06776d143f49.png';
import hostingIcon from '/lovable-uploads/6633ebe4-c56f-4a05-ae61-54f1f1de69a7.png';
import cloudIcon from '/lovable-uploads/d871fb3b-bd23-46a1-adcf-ee0290c701d8.png';
import securityIcon from '/lovable-uploads/1618c6a8-2676-4ce0-9e99-7d65f17477f7.png';
import solarIcon from '/lovable-uploads/ca85c645-5a19-4b83-82c8-6797f01310ad.png';
// fibrePrepaid uses connectivityIcon
import microsoftIcon from '/lovable-uploads/Microsoft.png';
import voipIcon from '/lovable-uploads/VOIP.png';
import itSupportIcon from '/lovable-uploads/IT Support.png';


const Services: React.FC = () => {
  const services = [
    {
      title: 'Web Design',
      description: 'Creative web design to enhance your online presence.',
      longDescription: 'Professional, responsive designs that capture your brand essence and provide seamless user experiences across all devices. Our web designs are optimized for conversions and built with the latest technologies.',
      icon: <Monitor size={36} />,
      customIcon: webDesignIcon, // Use imported variable
      link: '/web-design'
    },
    {
      title: 'Connectivity',
      description: 'Seamless connections free to the home/business/LTE.',
      longDescription: 'High-speed, reliable internet connectivity solutions for homes and businesses. We offer fiber, LTE, and wireless options customized to your specific needs and location requirements.',
      icon: <WifiIcon size={36} />,
      customIcon: connectivityIcon, // Use imported variable
      link: '/connectivity'
    },
    {
      title: 'Email & Automation',
      description: 'Efficient email systems and automation tools.',
      longDescription: 'Enterprise-grade email solutions with advanced security features. Our automation workflows streamline your business processes and increase productivity while reducing manual tasks.',
      icon: <Mail size={36} />,
      customIcon: emailIcon, // Use imported variable
      link: '/email-automation'
    },
    {
      title: 'Hosting',
      description: 'Reliable hosting services to keep your website online.',
      longDescription: 'Scalable, secure hosting solutions with 99.9% uptime guarantee. Our hosting packages include regular backups, security monitoring, and expert technical support available 24/7.',
      icon: <Server size={36} />,
      customIcon: hostingIcon, // Use imported variable
      link: '/hosting'
    },
    {
      title: 'Cloud Services',
      description: 'Reliable cloud solutions to manage and maintain your business.',
      longDescription: 'Comprehensive cloud infrastructure that scales with your business. Our cloud services include virtual servers, storage solutions, backup systems, and disaster recovery planning.',
      icon: <Globe size={36} />,
      customIcon: cloudIcon, // Use imported variable
      link: '/cloud-services'
    },
    {
      title: 'Security',
      description: 'Comprehensive security solutions for peace of mind.',
      longDescription: 'Multi-layered security approach to protect your digital assets. We provide firewall protection, intrusion detection, vulnerability assessments, and employee security awareness training.',
      icon: <Shield size={36} />,
      customIcon: securityIcon, // Use imported variable
      link: '/security'
    },
    {
      title: 'Solar Solutions',
      description: 'Innovative solar solutions for energy efficiency.',
      longDescription: 'Sustainable energy alternatives that reduce your carbon footprint and electricity costs. Our solar solutions are custom-designed for both residential and commercial properties.',
      icon: <Sun size={36} />,
      customIcon: solarIcon, // Use imported variable
      link: '/solar-solutions'
    },
    {
      title: 'Fibre Prepaid',
      description: 'High-speed fibre solutions for your internet needs.',
      longDescription: 'Flexible, no-contract fiber options with pay-as-you-go convenience. Get high-speed internet access without long-term commitments or hidden fees.',
      icon: <WifiIcon size={36} />,
      customIcon: connectivityIcon, // Use imported variable (same as connectivity)
      link: '/fibre-prepaid'
    },
    // Added Microsoft Business
    {
      title: 'Microsoft Business',
      description: 'Productivity and cloud solutions for modern businesses.',
      longDescription: 'Leverage Microsoft 365 and Azure with our expert setup, migration, and management services to enhance collaboration and scalability.',
      icon: <Briefcase size={36} />,
      customIcon: microsoftIcon, // Use imported variable
      link: '/microsoft-business'
    },
    // Added VoIP
    {
      title: 'VoIP',
      description: 'Modern, cost-effective business phone systems.',
      longDescription: 'Upgrade to a feature-rich Voice over IP system for clear calls, flexibility, and significant cost savings compared to traditional lines.',
      icon: <PhoneCall size={36} />,
      customIcon: voipIcon, // Use imported variable
      link: '/voip'
    },
    // Added IT Support
    {
      title: 'IT Support',
      description: 'Reliable tech support to keep your business running.',
      longDescription: 'Comprehensive remote and on-site IT support, proactive monitoring, and managed services to minimize downtime and maximize productivity.',
      icon: <Wrench size={36} />,
      customIcon: itSupportIcon, // Use imported variable
      link: '/it-support'
    }
  ];

  return (
    <section className="py-20 bg-hosting-light-gray">
      <div className="container-custom">
        <h2 className="section-heading animate-fade-up">Our Services</h2>
        <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
        
        {/* Changed from Grid to Flexbox for better centering of last row */}
        <div className="flex flex-wrap justify-center -mx-4 mt-12"> {/* Use negative margin to counteract padding */}
          {services.map((service, index) => (
            // Added width and padding classes to each item
            <div key={service.title} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8 flex flex-col"> {/* Added padding/margin */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex-grow">
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      icon={
                        <div className="flex justify-center items-center">
                          <img 
                            src={service.customIcon} 
                            alt={service.title} 
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      }
                      className="animate-fade-up"
                      containerClassName="h-full"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4 bg-white shadow-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="text-hosting-orange mb-2">
                      <img 
                        src={service.customIcon} 
                        alt={service.title} 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium bg-hosting-orange text-white px-2 py-1 rounded-full">Premium Service</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{service.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{service.longDescription}</p>
                  <div className="text-sm text-hosting-orange flex items-center">
                    <span>View service details</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <div className="mt-4 text-center flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to={service.link}
                        className="group inline-flex items-center text-hosting-orange text-sm font-medium group-hover:underline"
                      >
                        Learn More <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-hosting-orange text-white">
                      <p>Discover our {service.title.toLowerCase()} solutions!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
          {/* Removed placeholder div */}
        </div>
      </div>
    </section>
  );
};

export default Services;
