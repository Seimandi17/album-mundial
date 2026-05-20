"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureUserStickerRows } from "@/lib/data/stickers";

export async function updateUserSticker(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const stickerId = String(formData.get("stickerId") ?? "");
  const hasSticker = formData.get("hasSticker") === "true";
  const repeatedQuantity = Math.max(
    0,
    Number(formData.get("repeatedQuantity") ?? 0),
  );

  await ensureUserStickerRows(user.id);

  const { data: existing } = await supabase
    .from("user_stickers")
    .select("id")
    .eq("user_id", user.id)
    .eq("sticker_id", stickerId)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    sticker_id: stickerId,
    has_sticker: hasSticker,
    repeated_quantity: repeatedQuantity,
    updated_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from("user_stickers").update(payload).eq("id", existing.id)
    : await supabase.from("user_stickers").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/album");
  revalidatePath("/album/faltantes");
  revalidatePath("/album/repetidas");
  revalidatePath("/coincidencias");
  return { success: true };
}
