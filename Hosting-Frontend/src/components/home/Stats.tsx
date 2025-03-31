
import React, { useState, useEffect, useRef } from 'react';

interface StatItemProps {
  value: number;
  label: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setTimeout(() => {
            let start = 0;
            const duration = 2000; // animation duration in ms
            const increment = Math.ceil(value / (duration / 16)); // ~60fps
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(start);
              }
            }, 16);
            
            return () => clearInterval(timer);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, hasAnimated, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold mb-2 text-hosting-orange">
        {count}
        <span className="text-2xl">+</span>
      </div>
      <div className="text-hosting-dark-gray">{label}</div>
    </div>
  );
};

const Stats: React.FC = () => {
  return (
    <section className="py-16 bg-hosting-light-gray">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatItem value={99} label="Uptime Guarantee" delay={0} />
          <StatItem value={750} label="Websites Launched" delay={200} />
          <StatItem value={24} label="Customer Support" delay={400} />
        </div>
      </div>
    </section>
  );
};

export default Stats;
