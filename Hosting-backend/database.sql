-- MySQL/MariaDB Compatible Schema for Hosting KZN

-- Users Table (For Login/Roles)
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL, -- Added based on agents table needing name
  `role` ENUM('user', 'admin', 'agent') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agents Table
CREATE TABLE `agents` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL UNIQUE, -- Link to users table, allow NULL if agent isn't a user initially
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `referral_code` VARCHAR(50) NOT NULL UNIQUE,
  `active_clients` INT(11) DEFAULT 0,
  `total_sales` DECIMAL(12, 2) DEFAULT 0.00,
  `commission_rate` DECIMAL(5, 4) NOT NULL, -- e.g., 0.0500 for 5%
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending',
  `join_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_referral_code` (`referral_code`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE -- Optional FK
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `commission_rate` DECIMAL(5, 4) NOT NULL, -- Matches agents table type
  `features` JSON DEFAULT NULL, -- Store features array as JSON
  `is_active` TINYINT(1) NOT NULL DEFAULT 1, -- 1 for true, 0 for false
  `category` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients Table
CREATE TABLE `clients` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL, -- Allow NULL? Or make UNIQUE?
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `referred_by_agent_id` INT(11) DEFAULT NULL, -- Link to agents table
  `status` ENUM('active', 'inactive', 'pending', 'lead') NOT NULL DEFAULT 'pending', -- Added 'lead' based on schema diagram
  `join_date` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  FOREIGN KEY (`referred_by_agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE -- Optional FK
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions Table
CREATE TABLE `transactions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `transaction_date` DATE NOT NULL,
  `agent_id` INT(11) DEFAULT NULL,
  `client_id` INT(11) DEFAULT NULL,
  `product_id` INT(11) DEFAULT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `commission_amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('completed', 'pending', 'failed', 'refunded') NOT NULL DEFAULT 'pending', -- Added 'refunded' based on schema diagram
  `payment_method` VARCHAR(100) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_agent_id` (`agent_id`),
  INDEX `idx_client_id` (`client_id`),
  INDEX `idx_product_id` (`product_id`),
  FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Optional FK
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE, -- Optional FK
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE -- Optional FK
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Commission Payouts Table
CREATE TABLE `commission_payouts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `agent_id` INT(11) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `period` VARCHAR(50) NOT NULL, -- e.g., "March 2024"
  `status` ENUM('pending', 'processed', 'failed') NOT NULL DEFAULT 'pending',
  `payment_date` DATE DEFAULT NULL,
  `transaction_ids` JSON DEFAULT NULL, -- Store related transaction IDs as JSON array
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_agent_period` (`agent_id`, `period`),
  FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE -- Cascade delete if agent is removed? Or SET NULL?
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quotes Table (Wizard Submissions)
CREATE TABLE `quotes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `quote_number` VARCHAR(50) NOT NULL UNIQUE,
  `client_details` JSON DEFAULT NULL,
  `website_details` JSON DEFAULT NULL,
  `selected_services` JSON DEFAULT NULL,
  `sub_total` DECIMAL(12, 2) NOT NULL,
  `vat_amount` DECIMAL(12, 2) NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending', 'sent', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Submissions Table
CREATE TABLE `contact_submissions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `services_interested` TEXT DEFAULT NULL,
  `message` TEXT NOT NULL,
  `submitted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, -- Changed from created_at for clarity
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Table (Using simple key-value for flexibility, adjust if needed)
CREATE TABLE `settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Insert default settings if needed
-- INSERT INTO `settings` (`setting_key`, `setting_value`, `description`) VALUES
-- ('company_name', 'Hosting KZN', 'The name of the company'),
-- ('admin_email', 'admin@example.com', 'Default admin email'),
-- ... add other settings from the schema diagram ...
