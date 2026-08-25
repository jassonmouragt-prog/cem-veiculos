-- ============================================
-- MÓDULO FINANCEIRO - MIGRAÇÃO SUPABASE
-- ============================================

-- Novos enums
CREATE TYPE public.transaction_type AS ENUM ('entrada', 'saida');
CREATE TYPE public.transaction_category AS ENUM (
  'venda_veiculo', 'sinal_veiculo', 'recebimento_financiamento',
  'recebimento_parcelado', 'servicos', 'outros_recebimentos',
  'compra_veiculo', 'comissao', 'manutencao', 'documentacao',
  'despachante', 'lavagem', 'combustivel', 'marketing',
  'trafego_pago', 'aluguel', 'energia', 'agua', 'internet',
  'contabilidade', 'salarios', 'pro_labore', 'impostos',
  'seguros', 'fornecedores', 'equipamentos', 'escritorio', 'outros'
);
CREATE TYPE public.payment_method AS ENUM (
  'a_vista', 'financiamento', 'entrada_financiamento',
  'consorcio', 'pix', 'transferencia', 'cartao', 'outro'
);
CREATE TYPE public.payment_status AS ENUM ('pendente', 'pago', 'atrasado', 'cancelado');
CREATE TYPE public.commission_status AS ENUM ('pendente', 'a_pagar', 'pago');
CREATE TYPE public.sale_status AS ENUM ('concluida', 'cancelada');

-- Extender vehicles (adicionar custo de aquisição + data entrada estoque)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS acquisition_cost numeric DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS stock_entry_date timestamptz DEFAULT now();

-- Nova tabela: sellers (vendedores vinculados a usuários admin)
CREATE TABLE public.sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  commission_rate numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  can_receive_commission boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sellers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sellers TO authenticated;
GRANT ALL ON public.sellers TO service_role;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage sellers"
  ON public.sellers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Nova tabela: sales (vendas finalizadas)
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
  seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL,
  announced_price numeric NOT NULL,
  final_price numeric NOT NULL,
  discount_amount numeric DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  had_negotiation boolean DEFAULT false,
  acquisition_cost numeric NOT NULL,
  total_expenses numeric DEFAULT 0,
  gross_margin numeric GENERATED ALWAYS AS (final_price - acquisition_cost - total_expenses) STORED,
  net_margin numeric GENERATED ALWAYS AS (final_price - acquisition_cost - total_expenses - commission_value) STORED,
  commission_rate numeric DEFAULT 0,
  commission_value numeric DEFAULT 0,
  payment_method public.payment_method NOT NULL DEFAULT 'a_vista',
  total_received numeric DEFAULT 0,
  total_to_receive numeric DEFAULT 0,
  down_payment numeric DEFAULT 0,
  financed_amount numeric DEFAULT 0,
  sale_date timestamptz NOT NULL DEFAULT now(),
  status public.sale_status DEFAULT 'concluida',
  notes text,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vehicle_id)
);
GRANT SELECT ON public.sales TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage sales"
  ON public.sales FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_sales_seller ON public.sales(seller_id);
CREATE INDEX idx_sales_date ON public.sales(sale_date);

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Nova tabela: financial_transactions (entradas/saídas unificadas)
CREATE TABLE public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.transaction_type NOT NULL,
  category public.transaction_category NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  transaction_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz,
  paid_date timestamptz,
  payment_method public.payment_method,
  status public.payment_status DEFAULT 'pendente',
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  sale_id uuid REFERENCES public.sales(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES public.sellers(id) ON DELETE SET NULL,
  supplier text,
  client text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.financial_transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.financial_transactions TO authenticated;
GRANT ALL ON public.financial_transactions TO service_role;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage financial_transactions"
  ON public.financial_transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_ft_type ON public.financial_transactions(type);
CREATE INDEX idx_ft_category ON public.financial_transactions(category);
CREATE INDEX idx_ft_date ON public.financial_transactions(transaction_date);
CREATE INDEX idx_ft_due ON public.financial_transactions(due_date);
CREATE INDEX idx_ft_vehicle ON public.financial_transactions(vehicle_id);
CREATE INDEX idx_ft_sale ON public.financial_transactions(sale_id);
CREATE INDEX idx_ft_seller ON public.financial_transactions(seller_id);

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Nova tabela: vehicle_expenses (despesas vinculadas ao veículo)
CREATE TABLE public.vehicle_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  description text NOT NULL,
  category public.transaction_category NOT NULL,
  amount numeric NOT NULL,
  expense_date timestamptz NOT NULL DEFAULT now(),
  payment_status public.payment_status DEFAULT 'pendente',
  paid_date timestamptz,
  payment_method public.payment_method,
  supplier text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vehicle_expenses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vehicle_expenses TO authenticated;
GRANT ALL ON public.vehicle_expenses TO service_role;
ALTER TABLE public.vehicle_expenses ENABLE ROW LEVEL SECURITY.

CREATE POLICY "Admins manage vehicle_expenses"
  ON public.vehicle_expenses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_ve_vehicle ON public.vehicle_expenses(vehicle_id);

CREATE TRIGGER update_vehicle_expenses_updated_at
  BEFORE UPDATE ON public.vehicle_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Nova tabela: audit_log (auditoria financeira)
CREATE TABLE public.financial_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_fields text[],
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.financial_audit_log TO authenticated;
GRANT ALL ON public.financial_audit_log TO service_role;
ALTER TABLE public.financial_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit_log"
  ON public.financial_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_audit_table_record ON public.financial_audit_log(table_name, record_id);