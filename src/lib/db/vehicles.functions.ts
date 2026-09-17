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

    let { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return mapVehicle(data);

    // Fallback: try searching by base name extracted from slug
    // Slug format: "basename-year-random", e.g., "chevrolet-celta-2005-lvhj"
    // Extract the base term(s) and search in vehicle name
    const slugLower = slug.toLowerCase();
    const baseTerms = slugLower.split("-").slice(0, -2); // remove year and random suffix

    let found = null;
    for (const term of baseTerms) {
      if (term.length > 2) {
        ;({ data, error } = await supabase
          .from("vehicles")
          .select("*")
          .ilike("name", `%${term}%`)
          .maybeSingle());
        if (error) throw new Error(error.message);
        if (data) { found = data; break; }
      }
    }

    if (!found) {
      // Last resort: search entire slug as substring in name
      ;({ data, error } = await supabase
        .from("vehicles")
        .select("*")
        .ilike("name", `%${slug}%`)
        .maybeSingle());
      if (error) throw new Error(error.message);
      found = data;
    }

    return found ? mapVehicle(found) : null;
  });