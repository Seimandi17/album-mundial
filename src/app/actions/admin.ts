"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) {
    redirect("/album");
  }
  return profile;
}

export async function upsertSticker(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim() || null;
  const number = Number(formData.get("number"));
  const code = String(formData.get("code") ?? "").trim() || null;
  const countryCode =
    String(formData.get("countryCode") ?? "")
      .trim()
      .toUpperCase() || null;
  const team = String(formData.get("team") ?? "").trim() || null;
  const playerName = String(formData.get("playerName") ?? "").trim() || null;
  const section = String(formData.get("section") ?? "").trim() || null;
  const stickerType =
    String(formData.get("stickerType") ?? "").trim() || "numbered";
  const isSpecial = formData.get("isSpecial") === "on";
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const sourceName = String(formData.get("sourceName") ?? "").trim() || null;
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim() || null;

  const payload = {
    number,
    code,
    country_code: countryCode,
    team,
    player_name: playerName,
    section,
    sticker_type: stickerType,
    is_special: isSpecial,
    image_url: imageUrl,
    source_name: sourceName,
    source_url: sourceUrl,
    verified_at: sourceName || sourceUrl ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("stickers").update(payload).eq("id", id)
    : await supabase.from("stickers").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/figuritas");
  revalidatePath("/album");
  return { success: true };
}

export async function deleteSticker(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("stickers").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/figuritas");
  revalidatePath("/album");
  return { success: true };
}

export async function updateAlbumConfig(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const totalStickers = Math.max(1, Number(formData.get("totalStickers") ?? 980));
  const name = String(formData.get("name") ?? "Álbum Mundial 2026").trim();

  const { error } = await supabase
    .from("album_config")
    .update({
      name,
      total_stickers: totalStickers,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "mundial-2026");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/figuritas");
  return { success: true };
}

export async function seedStickersFromConfig() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: config } = await supabase
    .from("album_config")
    .select("total_stickers")
    .eq("id", "mundial-2026")
    .single();

  const total = config?.total_stickers ?? 980;
  const rows = Array.from({ length: total }, (_, i) => ({
    number: i + 1,
    team: null,
    player_name: null,
    section: null,
    sticker_type: "numbered",
    is_special: false,
  }));

  const { error } = await supabase
    .from("stickers")
    .upsert(rows, { onConflict: "number", ignoreDuplicates: true });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/figuritas");
  revalidatePath("/album");
  return { success: true, total };
}
