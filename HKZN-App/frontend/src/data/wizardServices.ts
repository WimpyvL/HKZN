export interface ServiceOption {
  name: string;
  oneOffCost: number;
  monthlyCost: number;
  description: string;
  features: string[];
}

export interface ServiceCategory {
  id: string;
  step: number;
  title: string;
  description: string;
  options: ServiceOption[];
}

export const serviceCategories: ServiceCategory[] = [
    {
        id: 'website-package',
        step: 3,
        title: 'Choose Your Website Package',
        description: 'Select the website package that best fits your business needs and digital presence requirements.',
        options: [
            {
                name: 'Essential Website Package',
                oneOffCost: 3999,
                monthlyCost: 0,
                description: 'A foundational package designed for small businesses to establish their online presence.',
                features: [
                    '.co.za Domain name registration',
                    'Essential Web hosting (2GB storage)',
                    'Custom designed website (3 pages with basic SSL)',
                    'Basic SEO optimization',
                    'Basic security setup'
                ]
            },
            {
                name: 'Enhanced Website Package',
                oneOffCost: 5999,
                monthlyCost: 0,
                description: 'Enhanced package for businesses expanding their online reach.',
                features: [
                    '.co.za Domain name registration',
                    'Enhanced Web hosting (5GB storage)',
                    'Custom designed website (5 pages with basic SSL)',
                    'Social media accounts creation/optimisation',
                    'Includes 2 months of monthly website maintenance',
                    'Advanced SEO optimisation and Security setup',
                    'Email marketing setup'
                ]
            },
            {
                name: 'Comprehensive Digital Package',
                oneOffCost: 9999,
                monthlyCost: 0,
                description: 'Comprehensive solution for businesses requiring advanced features.',
                features: [
                    '.co.za Domain name registration',
                    'Web hosting (10GB storage)',
                    'E-Commerce integrated website (with SSL)',
                    'Brand management services',
                    'Social media management',
                    'Includes 2 months of monthly website maintenance',
                    'AI-enhanced cybersecurity',
                    'Monthly performance reports for the first 3 months'
                ]
            },
            {
                name: 'Dominant Digital Package',
                oneOffCost: 17999,
                monthlyCost: 0,
                description: 'Complete digital transformation package for enterprises.',
                features: [
                    'Everything in the Comprehensive package',
                    'Mobile app development - entry level',
                    '24/7 AI-powered chatbot',
                    'Predictive analytic tools',
                    'Personalization engine',
                    'Advanced digital marketing campaigns',
                    '2 x Quarterly strategy sessions'
                ]
            }
        ]
    },
    {
        id: 'hosting-package',
        step: 4,
        title: 'Choose Your Hosting Package',
        description: 'Select a hosting package that determines the space allocated for your website\'s files, images, videos, emails and content.',
        options: [
            {
                name: 'Bronze Host',
                oneOffCost: 0,
                monthlyCost: 95,
                description: 'Basic hosting package for small websites.',
                features: [
                    '750MB Storage',
                    '3GB Bandwidth',
                    '2 Email Accounts'
                ]
            },
            {
                name: 'Silver Host',
                oneOffCost: 0,
                monthlyCost: 135,
                description: 'Medium-sized hosting package for growing businesses.',
                features: [
                    '1.5GB Storage',
                    '5GB Bandwidth',
                    '5 Email Accounts'
                ]
            },
            {
                name: 'Gold Host',
                oneOffCost: 0,
                monthlyCost: 195,
                description: 'Advanced hosting for larger websites.',
                features: [
                    '2GB Storage',
                    '10GB Bandwidth',
                    '10 Email Accounts'
                ]
            },
            {
                name: 'Diamond Host',
                oneOffCost: 0,
                monthlyCost: 295,
                description: 'Premium hosting solution for high-traffic websites.',
                features: [
                    '3.5GB Storage',
                    '15GB Bandwidth',
                    '20 Email Accounts'
                ]
            }
        ]
    },
    {
        id: 'maintenance-package',
        step: 5,
        title: 'Choose Your Website Maintenance Package',
        description: 'Select a maintenance package to keep your website healthy and functioning optimally.',
        options: [
            {
                name: 'Starter Maintenance',
                oneOffCost: 0,
                monthlyCost: 650,
                description: '1 Hour per month of maintenance services',
                features: [
                    'Security Rules Refresh',
                    'Check PHP & Compression Settings',
                    'Database & Performance Optimization',
                    'Security & Performance Scan',
                    'Backup & Backup Check',
                    'Basic Edits & Content Management: 10min'
                ]
            },
            {
                name: 'Medium Maintenance',
                oneOffCost: 0,
                monthlyCost: 999,
                description: '3 Hours per month of maintenance services',
                features: [
                    'All Starter Maintenance features',
                    'Extended Security & Performance Optimization',
                    'Regular Front-end Page Checks',
                    'Basic Edits & Content Management: 2 Hours'
                ]
            },
            {
                name: 'Intense Maintenance',
                oneOffCost: 0,
                monthlyCost: 1599,
                description: '6 Hours per month of maintenance services',
                features: [
                    'All Medium Maintenance features',
                    'Priority Support & Response',
                    'Advanced Security & Performance Optimization',
                    'Basic Edits & Content Management: 5 Hours'
                ]
            }
        ]
    },
    {
        id: 'facebook-marketing',
        step: 6,
        title: 'Facebook Marketing Services',
        description: 'Enhance your social media presence with our specialized Facebook marketing packages.',
        options: [
            {
                name: 'Starter Social Boost',
                oneOffCost: 0,
                monthlyCost: 650,
                description: 'Basic Facebook marketing package.',
                features: [
                    '2 Posts per Week',
                    'Basic Content Creation',
                    'Monthly Performance Report',
                    'Basic Audience Targeting'
                ]
            },
            {
                name: 'Social Growth',
                oneOffCost: 0,
                monthlyCost: 1999,
                description: 'Intermediate social media marketing package.',
                features: [
                    '5 Posts per Week',
                    'Professional Content Creation',
                    'Active Audience Engagement',
                    'Advanced Audience Targeting'
                ]
            },
            {
                name: 'Social Influence',
                oneOffCost: 0,
                monthlyCost: 4999,
                description: 'Advanced social media marketing package.',
                features: [
                    '7 Posts per Week',
                    'Premium Content Creation',
                    'Professional Ad Management',
                    'Custom Marketing Strategy'
                ]
            },
            {
                name: 'Social Domination',
                oneOffCost: 0,
                monthlyCost: 8999,
                description: 'Comprehensive social media marketing solution.',
                features: [
                    '14 Posts per Week',
                    'Premium Content & Strategy',
                    'Advanced Ad Management',
                    'Priority Support & Management'
                ]
            }
        ]
    },
    {
        id: 'google-my-business',
        step: 7,
        title: 'Google My Business Services',
        description: 'Optimize your local presence with Google My Business management.',
        options: [
            {
                name: 'GMB Growth',
                oneOffCost: 3000,
                monthlyCost: 800,
                description: 'Professional GMB management and optimization.',
                features: [
                    'Complete GMB Setup & Optimization',
                    'Monthly Updates & Management',
                    'Review Monitoring & Response',
                    'Performance Tracking & Reporting'
                ]
            }
        ]
    },
    {
        id: 'branding',
        step: 8,
        title: 'Branding & Design Services',
        description: 'Professional branding and design services (Design Only, Printing quoted separately).',
        options: [
            {
                name: 'Essentials Branding',
                oneOffCost: 2500,
                monthlyCost: 0,
                description: 'Basic branding package for new businesses.',
                features: [
                    'Basic Logo Design',
                    'Basic Business Card Design'
                ]
            },
            {
                name: 'Growth Branding',
                oneOffCost: 4500,
                monthlyCost: 0,
                description: 'Enhanced branding package for established businesses.',
                features: [
                    'Enhanced Logo Design',
                    'Professional Business Card Design',
                    'Brand Style Guidelines'
                ]
            }
        ]
    },
    {
        id: 'seo',
        step: 9,
        title: 'SEO Services',
        description: 'Improve your search engine rankings with our SEO packages.',
        options: [
            {
                name: 'Starter SEO',
                oneOffCost: 0,
                monthlyCost: 850,
                description: 'Local area SEO Optimization',
                features: [
                    'Local SEO Strategy',
                    'Basic Keyword Optimization',
                    'Monthly Performance Reports',
                    'Local Business Citations'
                ]
            },
            {
                name: 'Growth SEO',
                oneOffCost: 0,
                monthlyCost: 1900,
                description: 'National SEO Optimization',
                features: [
                    'National SEO Strategy',
                    'Advanced Keyword Research',
                    'Content Optimization',
                    'Comprehensive Reporting'
                ]
            },
            {
                name: 'Excellence SEO',
                oneOffCost: 0,
                monthlyCost: 6000,
                description: 'Enterprise-level SEO services',
                features: [
                    'International SEO Strategy',
                    'Advanced Technical SEO',
                    'Content Strategy & Creation',
                    'Competitive Analysis'
                ]
            }
        ]
    },
    {
        id: 'social-media-integration',
        step: 10,
        title: 'Social Media Integration',
        description: 'Integrate and manage your social media presence across all platforms.',
        options: [
            {
                name: 'Basic Integration',
                oneOffCost: 0,
                monthlyCost: 650,
                description: 'Essential social media integration package.',
                features: [
                    'Basic Platform Integration',
                    'Monthly Content Calendar',
                    'Basic Analytics Reporting',
                    'Platform Optimization'
                ]
            },
            {
                name: 'Premium Integration',
                oneOffCost: 0,
                monthlyCost: 3000,
                description: 'Advanced social media integration package.',
                features: [
                    'Multi-Platform Integration',
                    'Content Strategy Development',
                    'Advanced Analytics & Reporting',
                    'Engagement Monitoring'
                ]
            },
            {
                name: 'Enterprise Integration',
                oneOffCost: 0,
                monthlyCost: 4999,
                description: 'Comprehensive social media integration solution.',
                features: [
                    'Full-Scale Platform Integration',
                    'Custom Strategy Development',
                    'Real-Time Analytics & Reporting',
                    'Priority Support & Management'
                ]
            }
        ]
    },
    {
        id: 'mobile-app',
        step: 11,
        title: 'Mobile App Development',
        description: 'Create a custom mobile application for Android and iOS devices.',
        options: [
            {
                name: 'Basic App Development',
                oneOffCost: 25000,
                monthlyCost: 0,
                description: 'Essential mobile app development package.',
                features: [
                    'Native Android & iOS Development',
                    'Basic UI/UX Design',
                    'Core Functionality',
                    'App Store Submission'
                ]
            },
            {
                name: 'Advanced App Development',
                oneOffCost: 45000,
                monthlyCost: 0,
                description: 'Advanced mobile app development package.',
                features: [
                    'Native Android & iOS Development',
                    'Advanced UI/UX Design',
                    'Custom Features & Integration',
                    'Analytics Implementation',
                    'App Store Optimization'
                ]
            }
        ]
    }
];

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
    }).format(amount);
}

export function getCurrentCategory(step: number): ServiceCategory | undefined {
    return serviceCategories.find(category => category.step === step);
}
