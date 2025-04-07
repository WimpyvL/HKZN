# HKZN Project

This repository contains the code for the HKZN website, admin dashboard, and backend API.

## Project Structure

The project is organized as a monorepo using npm workspaces:

-   **`HKZN-App/frontend/`**: The public-facing website built with React, TypeScript, Vite, and Tailwind CSS (shadcn/ui).
-   **`HKZN-App/api/`**: A RESTful API built with PHP and MySQLi for data interaction.
-   **`/` (Root)**: Contains deployment scripts (`.cpanel.yml`), and configuration (`.gitignore`, `package.json`). (Note: This doesn't appear to be an npm workspace setup based on current structure).

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
    *   Run `npm install` in the `HKZN-App/frontend/` directory. (Note: Root `package.json` seems unrelated to the frontend app based on structure).

3.  **Configure Local Environment:**
    *   **Database:** The PHP API likely uses a configuration file within `HKZN-App/api/` (e.g., `db_connect.php`) for credentials. Check that directory for specifics.
    *   **API URL:** Create a `.env` file in the `HKZN-App/frontend/` directory. Add the following line, adjusting the URL if your local PHP server serves the API from a different path:
        ```
        VITE_API_BASE_URL=http://localhost/HKZN/HKZN-App/api
        ```

4.  **Run Development Servers:**
    *   Navigate to the `HKZN-App/frontend/` directory and run:
        ```bash
        npm run dev
        ```
    *   This will start the frontend development server (check terminal output for the specific port, often 5173 or similar).
    *   Ensure your local web server (e.g., XAMPP Apache) is configured to serve the PHP files from the `HKZN-App/api/` directory.

## Production Deployment (cPanel Git)

1.  **Build Applications:**
    *   Navigate to the `HKZN-App/frontend/` directory and run:
        ```bash
        npm run build
        ```
    *   This generates a production build in `HKZN-App/frontend/dist`.

2.  **Commit Changes:**
    *   Ensure the `HKZN-App/frontend/.gitignore` file does *not* ignore the `dist/` directory if you intend to commit the build output (which `.cpanel.yml` seems to rely on). Alternatively, modify the deployment script to build on the server.
    *   Add all changes, including the `dist` folder if committing it, to Git:
        ```bash
        # Example:
        git add HKZN-App/frontend/dist HKZN-App/api ... (and any other changed source files)
        ```
    *   Commit the changes:
        ```bash
        git commit -m "Prepare for deployment"
        ```
    *   Push to the deployment branch on GitHub (e.g., `Development` or `main`):
        ```bash
        git push origin Development
        ```
    *   *Note:* If Git warns about adding ignored files (`dist` folder), you might need to use `git add -f HKZN-App/frontend/dist` if it's listed in a higher-level `.gitignore`.

3.  **Deploy via cPanel:**
    *   Log in to cPanel -> Git Version Control.
    *   Manage the `HKZN` repository.
    *   Ensure the correct branch is checked out.
    *   Click "Update from Remote" to pull the latest commit.
    *   Click "Deploy HEAD Commit". This runs the script in `.cpanel.yml`, which builds the frontend (if not already built and committed) and copies `HKZN-App/frontend/dist/` and `HKZN-App/api/` files to `/home/domkzn/public_html/ReactDev`.

4.  **Manual Server Configuration:**
    *   Using cPanel File Manager or SSH:
        *   Ensure the web server (Apache/Nginx) is configured correctly to serve the React app (handling routing via `.htaccess` or server config) from `/home/domkzn/public_html/ReactDev`.
        *   Ensure PHP is configured correctly to run the API scripts in `/home/domkzn/public_html/ReactDev/api`.
        *   Edit `/home/domkzn/public_html/ReactDev/api/db_connect.php` (or relevant config file) and set the correct production database credentials.
        *   Ensure the production database (e.g., `domkzn_maindb`) exists and has the correct schema.
        *   Ensure correct file/directory permissions (usually 755 for directories, 644 for files within `public_html`).

5.  **Test:** Clear browser cache and access the site at `https://yourdomain.com/ReactDev/` and the dashboard at `https://yourdomain.com/ReactDev/admin-dashboard/`.

## Key Configuration Files

-   `.cpanel.yml`: Defines the cPanel deployment steps.
-   `.gitignore`: Specifies intentionally untracked files (ensure `dist` folders are un-ignored for deployment).
-   `package.json` (root): Seems to be for root-level dependencies or scripts, not directly managing the frontend app.
-   `HKZN-App/frontend/package.json`: Manages frontend dependencies and scripts (`dev`, `build`).
-   `HKZN-App/frontend/vite.config.ts`: Frontend build configuration.
-   `HKZN-App/frontend/public/.htaccess`: Production routing rules for the frontend SPA.
-   `HKZN-App/api/db_connect.php`: Likely contains database connection logic (check for production vs. local settings).
-   `.env` (in `HKZN-App/frontend/`): Used for environment variables like `VITE_API_BASE_URL`. Create manually for local dev or on the server for production (though Vite typically bundles env vars during build, check `vite.config.ts`).
