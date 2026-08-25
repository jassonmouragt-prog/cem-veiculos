import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Creates the very first administrator account.
 * It is a no-op (and returns created: false) as soon as one admin exists,
 * so it cannot be used to escalate privileges later on.
 */
export const ensureFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1).optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) throw new Error(countError.message);
    if ((count ?? 0) > 0) return { created: false };

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name ?? "Administrador C&M" },
    });

    if (createError || !created.user) throw new Error(createError?.message ?? "Falha ao criar administrador");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });

    if (roleError) throw new Error(roleError.message);

    return { created: true };
  });
