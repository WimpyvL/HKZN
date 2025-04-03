# HKZN Project

This repository contains the code for the HKZN website, admin dashboard, and backend API.

## Project Structure

The project is organized as a monorepo using npm workspaces:

-   **`/Hosting-Frontend`**: The public-facing website built with React, TypeScript, Vite, and Tailwind CSS (shadcn/ui).
-   **`/Hosting-backend`**: The internal admin/agent dashboard built with React, TypeScript, Vite, and Tailwind CSS (shadcn/ui).
-   **`/php-api`**: A RESTful API built with PHP and MySQLi for data interaction.
-   **`/` (Root)**: Contains workspace configuration (`package.json`), deployment scripts (`.cpanel.yml`), and shared configuration (`.gitignore`).

## Technology Stack

-   **Frontend/Dashboard:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand (for backend dashboard state), React Router.
-   **Backend API:** PHP (using MySQLi).
-   **Database:** MySQL / MariaDB.
-   **Development Environment:** Node.js, npm, XAMPP (or similar for local PHP/MySQL).
-   **Production Deployment:** cPanel with Git Version Control.

## Local Development Setup

1.  **Prerequisites:**
    *   Node.js and npm installed.
    *   XAMPP (or equivalent) installed and running (Apache & MySQL services).
    *   A local MySQL database created (e.g., named `hosting_kzn_db`). Import the schema from `Hosting-backend/database.sql` if needed, ensuring the `contact_submissions` table is included.

2.  **Install Dependencies:**
    *   Navigate to the root `HKZN` directory in your terminal.
    *   Run `npm install` (or `npm run install:all`). This installs dependencies for both frontend workspaces into the root `node_modules` folder.

3.  **Configure Local Environment:**
    *   **Database:** The PHP API uses `php-api/db_connect.local.php` for local credentials (defaults to user `root`, no password, database `hosting_kzn_db`). This file is ignored by Git.
    *   **API URL:** Create `.env.development` files in both `Hosting-Frontend` and `Hosting-backend` directories. Add the following line to each, adjusting the URL if your local PHP server serves the API from a different path:
        ```
        VITE_API_BASE_URL=http://localhost/HKZN/php-api
        ```
    *   **Supabase Auth (Backend Only):** If using Supabase for authentication in the backend dashboard locally, ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `Hosting-backend/.env.development`.

4.  **Run Development Servers:**
    *   From the root `HKZN` directory, run:
        ```bash
        npm run dev:all
        ```
    *   This will start both frontend apps concurrently:
        *   Frontend: `http://localhost:8080/`
        *   Backend Dashboard: `http://localhost:5173/`

## Production Deployment (cPanel Git)

1.  **Build Applications:**
    *   From the root `HKZN` directory, run:
        ```bash
        npm run build:all
        ```
    *   This generates production builds in `Hosting-Frontend/dist` and `Hosting-backend/dist`.

2.  **Commit Changes:**
    *   Ensure the `.gitignore` file includes `!Hosting-Frontend/dist/` and `!Hosting-backend/dist/` to allow committing the build folders.
    *   Add all changes, including the `dist` folders, to Git:
        ```bash
        git add .
        # Or more specifically:
        # git add .gitignore package.json package-lock.json Hosting-Frontend/dist Hosting-backend/dist php-api ... (and any other changed source files)
        ```
    *   Commit the changes:
        ```bash
        git commit -m "Prepare for deployment"
        ```
    *   Push to the deployment branch on GitHub (e.g., `Development` or `main`):
        ```bash
        git push origin Development
        ```
    *   *Note:* If Git warns about adding ignored files (`dist` folders), you might need to use `git add -f Hosting-Frontend/dist Hosting-backend/dist` for the commit that includes the build output.

3.  **Deploy via cPanel:**
    *   Log in to cPanel -> Git Version Control.
    *   Manage the `HKZN` repository.
    *   Ensure the correct branch is checked out.
    *   Click "Update from Remote" to pull the latest commit.
    *   Click "Deploy HEAD Commit". This runs the script in `.cpanel.yml`, copying files to `/home/domkzn/public_html/ReactDev`.

4.  **Manual Server Configuration:**
    *   Using cPanel File Manager or SSH:
        *   Create `/home/domkzn/public_html/ReactDev/.env` with `VITE_API_BASE_URL=/ReactDev/php-api`.
        *   Create `/home/domkzn/public_html/ReactDev/admin-dashboard/.env` with `VITE_API_BASE_URL=/ReactDev/php-api`.
        *   Edit `/home/domkzn/public_html/ReactDev/php-api/db_connect.php` and set the correct production database password.
        *   Ensure the production database (`domkzn_maindb`) exists and has the correct schema (including `contact_submissions` table).
        *   Ensure correct file/directory permissions (usually 755 for directories, 644 for files within `public_html`).

5.  **Test:** Clear browser cache and access the site at `https://yourdomain.com/ReactDev/` and the dashboard at `https://yourdomain.com/ReactDev/admin-dashboard/`.

## Key Configuration Files

-   `.cpanel.yml`: Defines the cPanel deployment steps.
-   `.gitignore`: Specifies intentionally untracked files (ensure `dist` folders are un-ignored for deployment).
-   `package.json` (root): Configures npm workspaces and root-level scripts.
-   `Hosting-Frontend/vite.config.ts`: Frontend build config (conditional `base` path).
-   `Hosting-backend/vite.config.ts`: Backend dashboard build config (conditional `base` path).
-   `Hosting-Frontend/public/.htaccess`: Production routing rules for the frontend SPA.
-   `Hosting-backend/public/.htaccess`: Production routing rules for the backend SPA.
-   `php-api/db_connect.php`: Default (production) database credentials and logic to load local overrides.
-   `php-api/db_connect.local.php`: (Optional, ignored by Git) Local database credentials.
-   `.env`: Production environment variables (created manually on server).
-   `.env.development`: Local development environment variables (overrides `.env` during `npm run dev`).
