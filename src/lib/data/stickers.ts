import { createClient } from "@/lib/supabase/server";
import type {
  AlbumConfig,
  Sticker,
  StickerGridItem,
  UserStickerWithSticker,
} from "@/types/database";

export async function getAlbumConfig(): Promise<AlbumConfig | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("album_config")
    .select("*")
    .eq("id", "mundial-2026")
    .single();

  return (data as AlbumConfig) ?? null;
}

export async function getAllStickers(): Promise<Sticker[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stickers")
    .select("*")
    .order("number");

  if (error) return [];
  return (data ?? []) as Sticker[];
}

export async function ensureUserStickerRows(userId: string) {
  const supabase = await createClient();
  await supabase.rpc("ensure_user_sticker_rows", { p_user_id: userId });
}

export async function getUserCollection(
  userId: string,
): Promise<UserStickerWithSticker[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_stickers")
    .select("*, stickers(*)")
    .eq("user_id", userId)
    .order("number", { foreignTable: "stickers", ascending: true });

  if (error || !data?.length) {
    await ensureUserStickerRows(userId);
    const retry = await supabase
      .from("user_stickers")
      .select("*, stickers(*)")
      .eq("user_id", userId)
      .order("number", { foreignTable: "stickers", ascending: true });

    return (retry.data ?? []) as UserStickerWithSticker[];
  }

  return data as UserStickerWithSticker[];
}

export async function getAlbumGrid(userId: string): Promise<StickerGridItem[]> {
  const stickers = await getAllStickers();
  const collection = await getUserCollection(userId);
  const byStickerId = new Map(
    collection.map((row) => [row.sticker_id, row]),
  );

  return stickers.map((sticker) => {
    const userSticker = byStickerId.get(sticker.id);
    return {
      ...sticker,
      user_sticker: userSticker
        ? {
            id: userSticker.id,
            has_sticker: userSticker.has_sticker,
            repeated_quantity: userSticker.repeated_quantity,
          }
        : undefined,
    };
  });
}

export function filterMissing(items: StickerGridItem[]) {
  return items.filter((item) => !item.user_sticker?.has_sticker);
}

export function filterDuplicates(items: StickerGridItem[]) {
  return items.filter((item) => (item.user_sticker?.repeated_quantity ?? 0) > 0);
}
