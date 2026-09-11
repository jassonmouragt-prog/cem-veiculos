-- Permitir excluir veículos mesmo quando possuem venda finalizada.
-- Antes: sales.vehicle_id NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT
-- -> bloquear a exclusão do veículo (FK violation 23503), então o veículo
--    "voltava" após atualizar a página.
-- Depois: vehicle_id nullable, ON DELETE SET NULL (preserva histórico financeiro).

ALTER TABLE public.sales DROP CONSTRAINT IF EXISTS sales_vehicle_id_fkey;
ALTER TABLE public.sales ALTER COLUMN vehicle_id DROP NOT NULL;
ALTER TABLE public.sales
  ADD CONSTRAINT sales_vehicle_id_fkey
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;