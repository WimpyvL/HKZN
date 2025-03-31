
import React from 'react';
import Layout from '../components/layout/Layout';
import Services from '../components/home/Services';
import FindService from '../components/home/FindService';
import AiIntegration from '../components/home/AiIntegration';
import SecuritySection from '../components/home/SecuritySection';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import { Helmet } from 'react-helmet-async';

const Index: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Hosting KZN | IT Solutions and Digital Services</title>
        <meta name="description" content="Comprehensive IT solutions including web design, hosting, connectivity, and solar solutions for businesses of all sizes." />
      </Helmet>
      {/* Video replacing BannerCarousel */}
      <div className="w-full overflow-hidden"> {/* Container to prevent layout shifts if needed */}
        <video 
          src="/lovable-uploads/Hosting Banners 2025 (3).mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-auto object-cover" // Adjust height/aspect ratio as needed
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {/* <Hero /> component removed */}
      <Services />
      <FindService />
      <AiIntegration />
      <SecuritySection />
      <Stats />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
