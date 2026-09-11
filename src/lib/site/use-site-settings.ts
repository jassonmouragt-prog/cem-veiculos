import { useEffect, useSyncExternalStore } from "react";
import { getSiteSettings, loadSiteSettings, subscribeToStore } from "@/lib/db/store";
import type { SiteSettings } from "@/lib/db/types";

/**
 * Hook reativo que entrega as configurações da concessionária
 * exibidas no site público (WhatsApp, endereço, horário, e-mail).
 */
export function useSiteSettings(): SiteSettings {
  const settings = useSyncExternalStore(
    (onStoreChange) => subscribeToStore(onStoreChange, true),
    getSiteSettings,
    getSiteSettings,
  );

  useEffect(() => {
    void loadSiteSettings();
  }, []);

  return settings;
}
