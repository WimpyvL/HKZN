import React, { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useInterval } from '@/hooks/use-interval';
import { User, Building, Briefcase, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  company: string;
  position: string;
  rating: number;
  icon: 'user' | 'business' | 'corporate';
}

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Hosting KZN transformed our business. Their solutions are top-notch and their support is exceptional! The cloud services they implemented have increased our productivity by 40%.",
      author: "Sarah Johnson",
      company: "Atlantic Media",
      position: "CTO",
      rating: 5,
      icon: 'corporate'
    },
    {
      id: 2,
      quote: "We've been using their web design and hosting services for over 3 years now. The reliability and performance are unmatched. Anytime we have an issue, their team resolves it within the hour.",
      author: "Michael Richards",
      company: "Blue Ocean Retail",
      position: "Marketing Director",
      rating: 5,
      icon: 'business'
    },
    {
      id: 3,
      quote: "Their solar solutions helped us reduce our energy costs by 60%. The installation was professional and they handled all the paperwork. I couldn't be happier with the results.",
      author: "Priya Patel",
      company: "GreenLife Organics",
      position: "Owner",
      rating: 5,
      icon: 'user'
    },
    {
      id: 4,
      quote: "The fiber connectivity has been a game-changer for our remote team. No more dropped calls or lagging video conferences. The speed and reliability are fantastic.",
      author: "David Mogale",
      company: "Innovative Solutions",
      position: "Operations Manager",
      rating: 4,
      icon: 'corporate'
    },
    {
      id: 5,
      quote: "Their security solutions give us peace of mind. After implementing their recommendations, we haven't had a single security incident. Their team is knowledgeable and proactive.",
      author: "Emma Thompson",
      company: "Financial Partners",
      position: "Security Director",
      rating: 5,
      icon: 'business'
    }
  ];

  // Auto-advance the carousel every 5 seconds
  useInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, 5000);

  const getIconComponent = (iconType: string) => {
    switch(iconType) {
      case 'user':
        return <User className="w-12 h-12 p-2 bg-hosting-orange text-white rounded-full" />;
      case 'business':
        return <Building className="w-12 h-12 p-2 bg-hosting-orange text-white rounded-full" />;
      case 'corporate':
        return <Briefcase className="w-12 h-12 p-2 bg-hosting-orange text-white rounded-full" />;
      default:
        return <User className="w-12 h-12 p-2 bg-hosting-orange text-white rounded-full" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-heading animate-fade-up">What Our Clients Say</h2>
        <div className="section-heading-divider animate-fade-up animate-delay-100"></div>
        
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <Carousel 
            className="w-full" 
            opts={{
              startIndex: currentIndex,
              loop: true,
              align: "center",
              dragFree: false,
              skipSnaps: false,
              inViewThreshold: 0.7,
              duration: 30
            }}
            setApi={(api) => {
              if (api) {
                api.on('select', () => {
                  setCurrentIndex(api.selectedScrollSnap());
                });
              }
            }}
          >
            {/* Added items-stretch to force items to equal height */}
            <CarouselContent className="transition-transform duration-700 ease-in-out items-stretch"> 
              {testimonials.map((testimonial) => (
                // Added flex to CarouselItem to help enforce equal height for children
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 h-full flex"> 
                  <div className="h-full bg-hosting-light-gray rounded-lg p-6 shadow-md flex flex-col mx-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="flex justify-center mb-4">
                      {getIconComponent(testimonial.icon)}
                    </div>
                    <div className="flex justify-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="text-center text-hosting-dark-gray flex-grow">
                      <p className="text-base italic mb-4">
                        "{testimonial.quote}"
                      </p>
                      <footer className="mt-auto">
                        <p className="font-semibold text-hosting-orange">{testimonial.author}</p>
                        <p className="text-sm text-hosting-medium-gray">{testimonial.position}, {testimonial.company}</p>
                      </footer>
                    </blockquote>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Removed pagination dots div */}
            
            <CarouselPrevious className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md transition-colors duration-300" />
            <CarouselNext className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md transition-colors duration-300" />
          </Carousel>
          
          <div className="text-center mt-12">
            <p className="text-hosting-medium-gray">Join our growing list of satisfied clients and experience our premium services.</p>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-hosting-orange">500+</span>
                <span className="text-sm text-hosting-medium-gray">Happy Clients</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-hosting-orange">98%</span>
                <span className="text-sm text-hosting-medium-gray">Satisfaction Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-hosting-orange">15+</span>
                <span className="text-sm text-hosting-medium-gray">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
