export type Profile = {
  id: string;
  name: string;
  email: string;
  city: string;
  province: string;
  whatsapp: string | null;
  instagram: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Sticker = {
  id: string;
  number: number;
  team: string | null;
  player_name: string | null;
  section: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSticker = {
  id: string;
  user_id: string;
  sticker_id: string;
  has_sticker: boolean;
  repeated_quantity: number;
  updated_at: string;
};

export type UserStickerWithSticker = UserSticker & {
  stickers: Sticker;
};

export type AlbumConfig = {
  id: string;
  name: string;
  total_stickers: number;
  updated_at: string;
};

export type TradeMatch = {
  user: Profile;
  theyHaveWhatINeed: number[];
  iHaveWhatTheyNeed: number[];
  score: number;
};

export type StickerGridItem = Sticker & {
  user_sticker?: Pick<UserSticker, "has_sticker" | "repeated_quantity" | "id">;
};
