-- ============================================
-- SITE SETTINGS (DADOS DA CONCESSIONÁRIA)
-- Tabela single-row: informações públicas exibidas
-- no site (WhatsApp, endereço, horário, e-mail).
-- ============================================

CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  dealer_name text NOT NULL DEFAULT 'C&M Veículos Ltda.',
  email text NOT NULL DEFAULT 'contato@cmveiculos.com.br',
  whatsapp_primary text NOT NULL DEFAULT '84991548912',
  whatsapp_secondary text NOT NULL DEFAULT '84999290088',
  address text NOT NULL DEFAULT 'Av. das Fronteiras, 1417',
  city text NOT NULL DEFAULT 'Natal/RN',
  hours_weekdays text NOT NULL DEFAULT 'Seg - Sex: 08h às 18h',
  hours_saturday text NOT NULL DEFAULT 'Sáb: 08h às 13h',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Inserir linha padrão
INSERT INTO public.site_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- Permissões: leitura pública (anon) e gravação apenas admin
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'site_settings'
  ) then
    alter publication supabase_realtime add table public.site_settings;
  end if;
end
$$;
