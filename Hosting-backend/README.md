# Agent Referral & Commission System

A modern, responsive admin dashboard for managing agent referrals and sales tracking, featuring a clean interface with real-time analytics and commission management capabilities.

## Features

- **User Authentication**: Secure login and registration for both admins and agents using Supabase Auth
- **Role-Based Access Control**: Separate admin and agent views with appropriate permissions
- **Product Management**: Create, edit, and manage product offerings with customizable commission rates
- **Client Management**: Register new clients with referral tracking
- **Commission System**: Automated commission calculations based on product sales
- **Analytics Dashboard**: Real-time metrics and visualizations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, ShadCN UI
- **State Management**: Zustand with Supabase integration
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Vite for building, any static hosting service

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/agent-referral-system.git
cd agent-referral-system
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

4. Set up the database

Run the SQL script in `database.sql` in your Supabase SQL editor to create all necessary tables and policies.

5. Generate TypeScript types for Supabase

```bash
npm run types:supabase
```

6. Start the development server

```bash
npm run dev
```

## Database Structure

The application uses the following tables in Supabase:

- **agents**: Stores agent information and performance metrics
- **clients**: Tracks clients and their referral relationships
- **products**: Manages product offerings across different categories
- **transactions**: Records sales and commission data
- **commission_payouts**: Handles commission payment processing
- **settings**: Stores application configuration

## Authentication

The system uses Supabase Authentication with custom user metadata to handle role-based access:

- **Admin users**: Full access to all system features
- **Agent users**: Limited access to their own clients and commissions

## Project Structure

- `/src/components`: UI components organized by feature
- `/src/lib`: Core functionality, API calls, and state management
- `/src/types`: TypeScript type definitions
- `/src/assets`: Static assets like images and icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.
