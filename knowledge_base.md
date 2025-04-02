# HKZN Project Knowledge Base (Summary as of 2025-04-02)

This document summarizes the key information, decisions, and status of the HKZN project based on the development session.

## 1. Project Overview

The project consists of three main parts:

1.  **`Hosting-Frontend`:** The main customer-facing website. (React, TypeScript, Vite, Tailwind CSS, shadcn/ui)
2.  **`Hosting-backend`:** An internal dashboard for Admins and Agents. (React, TypeScript, Vite, Tailwind CSS, shadcn/ui)
3.  **`php-api`:** A PHP backend providing a RESTful API for data interaction. (PHP, MySQL/MariaDB)

The goal was to refactor the applications, connect them to the PHP/MySQL backend (moving away from Supabase/mock data), implement basic CRUD operations, and prepare for deployment.

## 2. Technology Stack

*   **Frontend/Dashboard:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand (for auth/settings state)
*   **Backend API:** PHP (using MySQLi for database connection)
*   **Database:** MySQL / MariaDB (Database name: `domkzn_maindb`, User: `domkzn_main`)
*   **Deployment Target:** cPanel hosting environment.
*   **Version Control:** Git, GitHub (https://github.com/WimpyvL/HKZN.git)

## 3. Directory Structure & Deployment Target

*   **Root Directory:** `HKZN` (contains the three sub-projects)
*   **Deployment Subdirectory:** `/ReactDev/` within the server's `public_html`.
    *   Frontend (`Hosting-Frontend/dist`) deploys to `/home/domkzn/public_html/ReactDev/`
    *   Backend Dashboard (`Hosting-backend/dist`) deploys to `/home/domkzn/public_html/ReactDev/admin-dashboard/`
    *   PHP API (`php-api/`) deploys to `/home/domkzn/public_html/ReactDev/php-api/`

## 4. Database Schema

A MySQL-compatible schema was generated and saved in `Hosting-backend/database.sql`. Key tables include:
*   `users` (id, email, password_hash, name, role, timestamps)
*   `agents` (id, user_id, name, phone, referral_code, active_clients, total_sales, commission_rate, status, join_date, timestamps)
*   `products` (id, name, description, price, commission_rate, features (JSON), is_active, category, timestamps)
*   `clients` (id, name, email, phone, address, referred_by_agent_id, status, join_date, notes, timestamps)
*   `transactions` (id, transaction_date, agent_id, client_id, product_id, amount, commission_amount, status, payment_method, notes, timestamps)
*   `commission_payouts` (id, agent_id, amount, period, status, payment_date, transaction_ids (JSON), timestamps)
*   `quotes` (id, quote_number, client_details (JSON), website_details (JSON), selected_services (JSON), sub_total, vat_amount, total_amount, status, timestamps)
*   `contact_submissions` (id, name, email, phone, services_interested, message, submitted_at)
*   `settings` (id, setting_key, setting_value, description, timestamps)

*(Refer to `Hosting-backend/database.sql` for exact definitions, types, and constraints).*

## 5. Key Functionality Implemented

*   **Data Fetching Refactor:** Dashboard components (`ProductManagement`, `AgentsPage`, `ClientsPage`, `TransactionsPage`, `AdminCommissionPayouts`, `MetricsGrid`, `AgentsTable`, `SalesReport`, `CommissionPayouts`, `AnalyticsSection`) were refactored to fetch data from PHP API endpoints instead of Zustand store/mock data.
*   **PHP API Endpoints (GET):** Created `get_products.php`, `get_agents.php`, `get_clients.php`, `get_transactions.php`, `get_commission_payouts.php`, `get_quotes.php`.
*   **PHP API Endpoints (POST/UPDATE):**
    *   `add_agent.php`
    *   `add_client.php`
    *   `add_product.php`
    *   `add_transaction.php`
    *   `generate_payouts.php`
    *   `save_contact.php` (saves to DB & attempts email)
    *   `save_quote.php` (updated)
    *   `update_quote_status.php`
    *   `login.php` (uses sessions)
    *   `logout.php` (uses sessions)
    *   `register.php` (basic user creation)
    *   `check_auth.php` (uses sessions)
*   **Frontend "Add" Features:** Enabled forms/buttons for adding Agents, Clients, Products, Transactions, linked to respective PHP endpoints.
*   **Contact Form:** Updated to use `save_contact.php`. reCAPTCHA element added (backend validation pending).
*   **404 Pages:** Created and routed for both frontend and backend apps.
*   **Git Repository:** Initialized locally, pushed to GitHub.
*   **Deployment Config:** Created `.cpanel.yml` and `.htaccess` files configured for `/ReactDev/` deployment structure.

## 6. Configuration Files & Variables

*   **`Hosting-Frontend/vite.config.ts`:** `base` set to `/ReactDev/`.
*   **`Hosting-backend/vite.config.ts`:** `base` set to `/ReactDev/admin-dashboard/`.
*   **`Hosting-Frontend/.env`:** Contains `VITE_API_BASE_URL=/ReactDev/php-api`. **Must be created on the server.**
*   **`Hosting-backend/.env`:** Contains `VITE_API_BASE_URL=/ReactDev/php-api`. **Must be created on the server.**
*   **`php-api/db_connect.php`:** Contains database credentials. **Must be updated with production credentials on the server AFTER deployment. DO NOT COMMIT production credentials.**
*   **`Hosting-Frontend/public/.htaccess`:** Configured for SPA routing under `/ReactDev/`.
*   **`Hosting-backend/public/.htaccess`:** Configured for SPA routing under `/ReactDev/admin-dashboard/`.
*   **`.cpanel.yml`:** Defines deployment steps for cPanel Git Version Control, targeting `/home/domkzn/public_html/ReactDev`.

## 7. Outstanding Issues & Next Steps

*   **`get_clients.php` 500 Error:** This endpoint was still failing in previous tests. Requires checking server PHP error logs on cPanel to diagnose (likely a subtle schema mismatch or server issue). This prevents the Clients page and parts of the dashboard metrics from loading correctly.
*   **CRUD Operations:** Edit, Delete, and Process Payout functionalities are disabled in the UI and require corresponding PHP API endpoints (`update_*.php`, `delete_*.php`, `process_payout.php`) and frontend logic implementation.
*   **Data Mapping:** Components currently display IDs for related entities (Agent, Client, Product) in tables. Need to fetch related data (e.g., in PHP endpoints using JOINs or separate frontend fetches) to display names.
*   **Filtering:** Agent/Product filters in `ClientsPage` and `AdminCommissionPayouts` are disabled/using IDs; need to be updated once related data (names) is fetched.
*   **Authentication:** The PHP `login.php` and `register.php` are basic. Consider strengthening security (e.g., more robust password handling, user activation). The link between `users` and `agents` tables needs clarification and implementation in `add_agent.php`. The `useStore` auth simulation should be replaced with logic that relies fully on the PHP session status via `check_auth.php`.
*   **reCAPTCHA:** Backend validation for the contact form's reCAPTCHA token needs to be added in `save_contact.php`.
*   **Deployment:** Execute the deployment steps on cPanel (Database setup, File deployment, Configuration).
