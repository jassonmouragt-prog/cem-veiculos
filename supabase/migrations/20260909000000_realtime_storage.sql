-- ============================================
-- REALTIME + IMAGE STORAGE - MIGRAÇÃO
-- Habilita após (tempo real) e storage de fotos
-- ============================================

-- 1) Ativa o Realtime (postgres_changes) nas tabelas do app.
--    Eventos de INSERT/UPDATE/DELETE serão empurrados para o painel admin
--    sem precisar recarregar a página.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'vehicles'
  ) then
    alter publication supabase_realtime add table public.vehicles;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sellers'
  ) then
    alter publication supabase_realtime add table public.sellers;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sales'
  ) then
    alter publication supabase_realtime add table public.sales;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'financial_transactions'
  ) then
    alter publication supabase_realtime add table public.financial_transactions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'vehicle_expenses'
  ) then
    alter publication supabase_realtime add table public.vehicle_expenses;
  end if;
end
$$;

-- 2) Bucket público para as fotos dos veículos (máx 10MB por arquivo).
--    Fotos enviadas aqui viram URLs (pequenas) no lugar de base64 (pesado),
--    o que deixa o carregamento do site muito mais rápido.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']
)
on conflict (id) do nothing;

-- 3) Políticas do bucket: leitura pública + administradores podem
--    enviar, atualizar e remover fotos.
create policy "Public read vehicle images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'vehicle-images');

create policy "Admins upload vehicle images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'vehicle-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update vehicle images"
  on storage.objects for update to authenticated
  using (bucket_id = 'vehicle-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete vehicle images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'vehicle-images' and public.has_role(auth.uid(), 'admin'));