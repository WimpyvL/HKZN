# Hosting KZN - Frontend Application

This is the main customer-facing frontend application for Hosting KZN, built with React, TypeScript, Vite, and Tailwind CSS (using shadcn/ui components).

## Features

*   Displays company information, services, and contact details.
*   Includes a contact form for user inquiries.
*   Provides user authentication (Login/Register).
*   Contains a service wizard for generating quotes.
*   Links to the admin/agent dashboard for authenticated users with appropriate roles.

## Project Structure

*   `public/`: Static assets.
*   `src/`: Source code.
    *   `components/`: Reusable UI components (common, contact, home, layout, ui, wizard).
    *   `contexts/`: React contexts (e.g., authentication).
    *   `data/`: Static data (e.g., wizard services).
    *   `hooks/`: Custom React hooks (e.g., form handling).
    *   `lib/`: Utility functions.
    *   `pages/`: Top-level page components corresponding to routes.
    *   `main.tsx`: Application entry point.
    *   `App.tsx`: Main application component with routing.

## Setup and Running Locally

1.  **Prerequisites:**
    *   Node.js (v18 or later recommended)
    *   npm (usually comes with Node.js)
    *   A running instance of the `php-api` backend (see backend README).

2.  **Installation:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    *   Create a `.env` file in the `Hosting-Frontend` root directory.
    *   Add the following variable, pointing to your running PHP API:
        ```
        VITE_API_BASE_URL=http://localhost/HKZN/php-api
        ```
        (Adjust the URL if your local setup differs).

4.  **Running the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173` (or the next available port).

5.  **Building for Production:**
    ```bash
    npm run build
    ```
    This creates an optimized build in the `dist` directory, ready for deployment.

## Backend API

This frontend requires the `php-api` backend to be running for authentication, quote saving, and contact form submission. Ensure the `VITE_API_BASE_URL` in the `.env` file points to the correct location of the running API.
