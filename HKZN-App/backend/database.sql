-- Create tables for Agent Referral & Commission System

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create agents table
CREATE TABLE public.agents (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    referral_code TEXT NOT NULL UNIQUE,
    active_clients INTEGER DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0,
    commission_rate DECIMAL(5, 4) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
    join_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    referred_by TEXT NOT NULL,
    product TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
    join_date DATE NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) NOT NULL,
    features TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    agent_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    product TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    commission DECIMAL(12, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commission_payouts table
CREATE TABLE public.commission_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id),
    agent_name TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    period TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'failed')),
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    timezone TEXT NOT NULL,
    date_format TEXT NOT NULL,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    default_commission_rate DECIMAL(5, 2) NOT NULL,
    min_commission_rate DECIMAL(5, 2) NOT NULL,
    max_commission_rate DECIMAL(5, 2) NOT NULL,
    payout_threshold DECIMAL(12, 2) NOT NULL,
    auto_approve BOOLEAN NOT NULL DEFAULT TRUE,
    tiered_rates BOOLEAN NOT NULL DEFAULT FALSE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    new_client_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    commission_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    agent_activity_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    notification_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_agents_modtime
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_clients_modtime
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_transactions_modtime
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_commission_payouts_modtime
    BEFORE UPDATE ON public.commission_payouts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_settings_modtime
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for agents
CREATE POLICY "Agents can view their own data" ON public.agents
    FOR SELECT
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

CREATE POLICY "Admins can update agents" ON public.agents
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

CREATE POLICY "Agents can update their own data" ON public.agents
    FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for clients
CREATE POLICY "Agents can view their referred clients" ON public.clients
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = referred_by
        )
    ));

CREATE POLICY "Agents can insert their referred clients" ON public.clients
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = referred_by
        )
    ));

CREATE POLICY "Agents can update their referred clients" ON public.clients
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = referred_by
        )
    ));

CREATE POLICY "Agents can delete their referred clients" ON public.clients
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = referred_by
        )
    ));

-- Create policies for products
CREATE POLICY "Everyone can view products" ON public.products
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Create policies for transactions
CREATE POLICY "Agents can view their transactions" ON public.transactions
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = agent_name
        )
    ));

CREATE POLICY "Agents can insert their transactions" ON public.transactions
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.users.raw_user_meta_data->>'name' = agent_name
        )
    ));

CREATE POLICY "Admins can update transactions" ON public.transactions
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Create policies for commission payouts
CREATE POLICY "Agents can view their payouts" ON public.commission_payouts
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND (
            auth.users.raw_user_meta_data->>'role' = 'admin' OR
            auth.uid() = agent_id
        )
    ));

CREATE POLICY "Admins can manage payouts" ON public.commission_payouts
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Create policies for settings
CREATE POLICY "Everyone can view settings" ON public.settings
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_payouts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;


-- Create quotes table to store wizard submissions
CREATE TABLE public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number TEXT NOT NULL UNIQUE,
    client_details JSONB, -- Stores { businessName, contactPerson, email, phone, address }
    website_details JSONB, -- Stores { websiteName, domain, template }
    selected_services JSONB, -- Stores array of selected service objects
    sub_total DECIMAL(12, 2) NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    -- Add total_monthly_cost if needed separately
    -- total_monthly_cost DECIMAL(12, 2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apply updated_at trigger
CREATE TRIGGER update_quotes_modtime
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotes
-- Allow anonymous users (using anon key) to insert quotes
CREATE POLICY "Allow anonymous insert for quotes" ON public.quotes
    FOR INSERT
    WITH CHECK (auth.role() = 'anon');

-- Allow admins full access
CREATE POLICY "Allow admin full access on quotes" ON public.quotes
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;


-- Create contact_submissions table
-- Note: This uses standard SQL types suitable for MySQL/MariaDB, not PostgreSQL specific ones.
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    services_interested TEXT,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: No RLS or realtime needed for this simple contact table usually.


-- Insert initial admin user (you'll need to replace this with your actual admin user ID)
-- This assumes you've already created a user through Supabase Auth
-- INSERT INTO public.agents (id, name, email, phone, referral_code, commission_rate, status, join_date)
-- VALUES ('your-admin-user-id', 'Admin User', 'admin@example.com', '(555) 123-4567', 'ADMIN001', 0.05, 'active', CURRENT_DATE);
