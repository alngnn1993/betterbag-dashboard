/**
 * FINN DATABASE SCHEMA
 * Supabase PostgreSQL
 * 
 * Complete data model for Finn AI CEO System
 */

-- ============================================
-- CONVERSATIONS & LEARNING
-- ============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  message_count INTEGER DEFAULT 0,
  expertise_gain INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  importance VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
  embeddings VECTOR(1536), -- For semantic search (Pinecone integration)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expertise_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  domain VARCHAR(100) NOT NULL, -- 'finance', 'marketing', 'operations', 'customer_success', 'product', 'strategy'
  expertise_level DECIMAL(5, 2) DEFAULT 0, -- 0-100
  confidence_score DECIMAL(5, 2) DEFAULT 0,
  concepts_learned INTEGER DEFAULT 0,
  decisions_observed INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BUSINESS DATA
-- ============================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  business_name VARCHAR(255),
  subscription_status VARCHAR(50), -- 'active', 'paused', 'cancelled'
  subscription_tier VARCHAR(50), -- 'discovery_pack', 'individual_s', 'individual_m', 'individual_l', 'bundle_tier1', etc
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  churn_risk DECIMAL(5, 2) DEFAULT 0, -- Finn's prediction of churn
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (subscription_status)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_date DATE NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50), -- 'pending', 'shipped', 'delivered', 'returned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_customer_id (customer_id),
  INDEX idx_order_date (order_date)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  monthly_price DECIMAL(10, 2) NOT NULL,
  boxes_per_month INTEGER,
  bags_per_month INTEGER,
  start_date DATE NOT NULL,
  renewal_date DATE,
  cancellation_date DATE,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_customer_id (customer_id),
  INDEX idx_status (status)
);

-- ============================================
-- FINANCIAL DATA
-- ============================================

CREATE TABLE financial_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  monthly_recurring_revenue DECIMAL(15, 2),
  total_revenue DECIMAL(15, 2),
  total_expenses DECIMAL(15, 2),
  net_profit DECIMAL(15, 2),
  active_customers INTEGER,
  new_customers INTEGER,
  churned_customers INTEGER,
  average_order_value DECIMAL(10, 2),
  customer_acquisition_cost DECIMAL(10, 2),
  lifetime_value DECIMAL(10, 2),
  churn_rate DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

CREATE TABLE pricing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) NOT NULL UNIQUE,
  product_name VARCHAR(255),
  category VARCHAR(50), -- 'individual_subscription', 'bundle_subscription', 'one_time'
  size VARCHAR(10), -- 'S', 'M', 'L'
  regular_price DECIMAL(10, 2),
  subscription_price DECIMAL(10, 2),
  cost_of_goods DECIMAL(10, 2),
  margin_percentage DECIMAL(5, 2),
  bags_count INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MARKETING & PERFORMANCE
-- ============================================

CREATE TABLE ad_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  channel VARCHAR(100), -- 'meta', 'google', 'organic', 'email'
  date DATE,
  impressions INTEGER,
  clicks INTEGER,
  cost DECIMAL(12, 2),
  orders DECIMAL(10, 2),
  revenue DECIMAL(12, 2),
  ctr DECIMAL(5, 2), -- Click-through rate
  cpc DECIMAL(10, 2), -- Cost per click
  cpa DECIMAL(10, 2), -- Cost per acquisition
  roas DECIMAL(5, 2), -- Return on ad spend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_campaign_id (campaign_id),
  INDEX idx_date (date),
  INDEX idx_channel (channel)
);

CREATE TABLE email_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email_type VARCHAR(100), -- 'discovery_pack_welcome', 'subscription_offer', 'bundle_upsell', etc
  sent_date TIMESTAMP WITH TIME ZONE,
  opened BOOLEAN DEFAULT FALSE,
  opened_date TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_date TIMESTAMP WITH TIME ZONE,
  converted BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- OPERATIONS & SUPPORT
-- ============================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  subject VARCHAR(255),
  description TEXT,
  status VARCHAR(50), -- 'open', 'in_progress', 'resolved', 'closed'
  priority VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
  resolved_date TIMESTAMP WITH TIME ZONE,
  resolution_time_hours DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_customer_id (customer_id)
);

CREATE TABLE refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reason VARCHAR(255),
  amount DECIMAL(12, 2),
  status VARCHAR(50), -- 'pending', 'approved', 'rejected', 'processed'
  approval_notes TEXT,
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

-- ============================================
-- FINN OPERATIONS
-- ============================================

CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type VARCHAR(100), -- 'recommendation', 'autonomous_action', 'alert'
  domain VARCHAR(100),
  description TEXT,
  finn_recommendation TEXT,
  user_approval VARCHAR(50), -- 'approved', 'rejected', 'modified', 'pending'
  outcome TEXT,
  result_impact DECIMAL(5, 2), -- How well decision performed
  learning_applied TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_decision_type (decision_type),
  INDEX idx_created_at (created_at)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100), -- 'data_access', 'decision_made', 'recommendation_given', 'breach_detected'
  actor VARCHAR(255), -- 'finn', 'user', 'system'
  details JSONB,
  data_accessed JSONB,
  ip_address INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_actor (actor)
) PARTITION BY RANGE (timestamp); -- For large audit logs

CREATE TABLE knowledge_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(100), -- 'financial_overview', 'pricing_strategy', 'ceo_brief', 'market_analysis'
  document_name VARCHAR(255),
  content TEXT,
  embeddings VECTOR(1536),
  version INTEGER DEFAULT 1,
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_document_type (document_type)
);

CREATE TABLE sub_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'finance', 'marketing', 'operations', 'customer_success', 'product'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'training'
  expertise_level DECIMAL(5, 2) DEFAULT 0,
  knowledge_base JSONB,
  performance_score DECIMAL(5, 2) DEFAULT 0,
  created_by_finn BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_customers_created ON customers(created_at);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_financial_date ON financial_metrics(date);
CREATE INDEX idx_ad_performance_date ON ad_performance(date);
CREATE INDEX idx_support_created ON support_tickets(created_at);

-- ============================================
-- RLS (Row Level Security) - Optional
-- ============================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for user data access
CREATE POLICY "Users can access their own conversations"
  ON conversations
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id'));
