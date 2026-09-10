import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { mapVehicle } from "./store";
import type { Vehicle } from "./types";

/**
 * Busca no servidor (SSR) apenas as colunas necessárias para exibir os cards
 * de veículos nas páginas públicas (home e estoque). Reduz bastante o
 * payload enviado ao navegador, deixando o carregamento mais rápido.
 */
export const getPublicVehiclesSummaryServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, slug, name, brand, model, version, model_year, category, fuel, transmission, mileage, price, entry_value, installments_count, installment_value, images, main_image_index, status, is_featured, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapVehicle);
  },
);

/**
 * Busca no servidor (SSR) um veículo completo pelo slug, usado na página de
 * detalhe — evita baixar o estoque inteiro para exibir apenas um veículo.
 */
export const getVehicleBySlugServer = createServerFn({ method: "GET" })
  .validator((d: unknown) => (typeof d === "string" ? d : ""))
  .handler(async ({ data: slug }): Promise<Vehicle | null> => {
    if (!slug) return null;

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapVehicle(data) : null;
  });