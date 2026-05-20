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
  code: string | null;
  country_code: string | null;
  team: string | null;
  player_name: string | null;
  section: string | null;
  sticker_type: string;
  is_special: boolean;
  image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  verified_at: string | null;
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
