# Hosting KZN - Admin/Agent Dashboard

This is the internal dashboard application for Hosting KZN administrators and agents, built with React, TypeScript, Vite, and Tailwind CSS (using shadcn/ui components).

## Features

*   Provides separate views/functionality for Admins and Agents.
*   **Admin:**
    *   Dashboard overview (Metrics, Recent Activity).
    *   Agent Management (View, Add - Edit/Delete WIP).
    *   Client Management (View, Add - Edit/Delete WIP).
    *   Product Management (View, Add - Edit/Delete/Status Toggle WIP).
    *   Transaction Viewing.
    *   Commission Payout Management (View, Generate, Process - Process WIP).
    *   Quote Submission Viewing & Status Updates.
    *   Settings Management (WIP).
*   **Agent:**
    *   Dashboard overview (Agent-specific stats).
    *   Client Registration.
    *   View Referred Clients.
    *   View Available Products.
    *   View Commissions Earned & Payouts.
    *   Settings (WIP).

## Project Structure

*   `public/`: Static assets.
*   `src/`: Source code.
    *   `components/`: Reusable UI components.
        *   `admin/`: Components specific to the Admin view.
        *   `agent-dashboard/`: Components specific to the Agent view.
        *   `agents/`, `clients/`, `products/`, `transactions/`, `settings/`: Page components for managing respective data.
        *   `auth/`: Authentication-related components (Login, Register, Protected Routes).
        *   `dashboard/`: Components used across dashboard views (Sidebar, Metrics, Tables).
        *   `modals/`: Reusable modal dialog components.
        *   `ui/`: Base UI components from shadcn/ui.
    *   `lib/`: Utility functions, API interaction logic (now primarily via direct fetch), and Zustand store (for Auth/Settings).
    *   `main.tsx`: Application entry point.
    *   `App.tsx`: Main application component with routing.

## Setup and Running Locally

1.  **Prerequisites:**
    *   Node.js (v18 or later recommended)
    *   npm (usually comes with Node.js)
    *   A running instance of the `php-api` backend.
    *   A configured MySQL database (`hosting_kzn_db`) with the schema defined in `database.sql`.

2.  **Installation:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    *   Create a `.env` file in the `Hosting-backend` root directory.
    *   Add the following variable, pointing to your running PHP API:
        ```
        VITE_API_BASE_URL=http://localhost/HKZN/php-api
        ```
        (Adjust the URL if your local setup differs).

4.  **Running the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173` (or the next available port). Accessing `/` might show a selector, while `/admin` or `/agent` would lead to the respective dashboards after login.

5.  **Building for Production:**
    ```bash
    npm run build
    ```
    This creates an optimized build in the `dist` directory. The `vite.config.ts` is configured with `base: "/admin-dashboard/"`, so these files should be deployed to a subdirectory named `admin-dashboard` on your web server.

## Backend API

This dashboard relies heavily on the `php-api` backend for all data fetching and manipulation (except for local auth state and settings managed by Zustand). Ensure the `VITE_API_BASE_URL` in the `.env` file points to the correct location of the running API.
