import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { mapVehicle } from "./store";
import type { Vehicle } from "./types";

/**
 * Fetches the public vehicles on the server (SSR) so public pages render the
 * stock immediately instead of waiting for the full client-side store load.
 */
export const getPublicVehiclesServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapVehicle);
  },
);
