// Product categories for the application
export type ProductCategory =
  | "web"
  | "solar"
  | "fiber"
  | "hosting"
  | "mobile"
  | "ecommerce"
  | "security"
  | string;

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
}

export const productCategories: Record<string, CategoryInfo> = {
  web: {
    id: "web",
    name: "Web Development",
    description: "Website development and digital services",
    icon: "Globe",
  },
  solar: {
    id: "solar",
    name: "Solar Installation",
    description: "Solar panel installation and energy solutions",
    icon: "Sun",
  },
  fiber: {
    id: "fiber",
    name: "Fiber Installation",
    description: "Fiber optic internet installation and connectivity",
    icon: "Wifi",
  },
  hosting: {
    id: "hosting",
    name: "Web Hosting",
    description: "Website hosting and server management services",
    icon: "Server",
  },
  mobile: {
    id: "mobile",
    name: "Mobile App Development",
    description: "iOS and Android mobile application development",
    icon: "Smartphone",
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-Commerce Solutions",
    description: "Online store and e-commerce platform development",
    icon: "ShoppingCart",
  },
  security: {
    id: "security",
    name: "Cybersecurity Services",
    description: "Website security, audits, and protection services",
    icon: "Shield",
  },
  cloud: {
    id: "cloud",
    name: "Cloud Services",
    description: "Cloud hosting, storage, and computing solutions",
    icon: "Cloud",
  },
  database: {
    id: "database",
    name: "Database Solutions",
    description: "Database design, implementation, and management",
    icon: "Database",
  },
};

// Default products for each category
export const solarProducts = [
  {
    id: "solar-1",
    name: "Residential Solar Package",
    description: "Complete solar solution for residential properties",
    price: 45000,
    commissionRate: 0.05,
    features: [
      "5kW Solar System",
      "Inverter Installation",
      "Battery Backup",
      "Professional Installation",
      "5-Year Warranty",
    ],
    category: "solar" as ProductCategory,
    isActive: true,
  },
  {
    id: "solar-2",
    name: "Business Solar Package",
    description: "High-capacity solar solution for businesses",
    price: 120000,
    commissionRate: 0.06,
    features: [
      "15kW Solar System",
      "Commercial Grade Inverters",
      "Advanced Battery Storage",
      "Professional Installation",
      "Energy Management System",
      "10-Year Warranty",
    ],
    category: "solar" as ProductCategory,
    isActive: true,
  },
  {
    id: "solar-3",
    name: "Solar Maintenance Plan",
    description: "Annual maintenance and support for solar installations",
    price: 3500,
    commissionRate: 0.08,
    features: [
      "Bi-annual System Inspection",
      "Panel Cleaning",
      "Performance Monitoring",
      "Priority Support",
      "Parts Replacement Coverage",
    ],
    category: "solar" as ProductCategory,
    isActive: true,
  },
];

export const fiberProducts = [
  {
    id: "fiber-1",
    name: "Home Fiber Connection",
    description: "High-speed fiber internet for residential properties",
    price: 1500,
    commissionRate: 0.07,
    features: [
      "Up to 100Mbps Speed",
      "Router Installation",
      "Unlimited Data",
      "Professional Installation",
      "24/7 Technical Support",
    ],
    category: "fiber" as ProductCategory,
    isActive: true,
  },
  {
    id: "fiber-2",
    name: "Business Fiber Connection",
    description: "Enterprise-grade fiber internet for businesses",
    price: 3500,
    commissionRate: 0.08,
    features: [
      "Up to 500Mbps Speed",
      "Enterprise Router Setup",
      "Unlimited Data",
      "Static IP Address",
      "SLA Guaranteed Uptime",
      "Priority Technical Support",
    ],
    category: "fiber" as ProductCategory,
    isActive: true,
  },
  {
    id: "fiber-3",
    name: "Fiber Network Installation",
    description: "Complete fiber network setup for large properties",
    price: 15000,
    commissionRate: 0.06,
    features: [
      "Full Property Coverage",
      "Multiple Access Points",
      "Network Configuration",
      "Professional Installation",
      "Network Security Setup",
      "3-Year Warranty",
    ],
    category: "fiber" as ProductCategory,
    isActive: true,
  },
];
