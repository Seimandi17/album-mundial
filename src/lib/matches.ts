import type { Profile, TradeMatch, UserStickerWithSticker } from "@/types/database";

type CollectionMaps = {
  missing: Set<number>;
  duplicates: Set<number>;
};

function buildCollectionMaps(rows: UserStickerWithSticker[]): CollectionMaps {
  const missing = new Set<number>();
  const duplicates = new Set<number>();

  for (const row of rows) {
    const number = row.stickers.number;
    if (!row.has_sticker) {
      missing.add(number);
    }
    if (row.repeated_quantity > 0) {
      duplicates.add(number);
    }
  }

  return { missing, duplicates };
}

function intersectNumbers(a: Set<number>, b: Set<number>): number[] {
  const result: number[] = [];
  for (const n of a) {
    if (b.has(n)) {
      result.push(n);
    }
  }
  return result.sort((x, y) => x - y);
}

export function computeTradeMatch(
  currentUserId: string,
  myCollection: UserStickerWithSticker[],
  theirCollection: UserStickerWithSticker[],
  theirProfile: Profile,
): TradeMatch | null {
  if (theirProfile.id === currentUserId) {
    return null;
  }

  const mine = buildCollectionMaps(myCollection);
  const theirs = buildCollectionMaps(theirCollection);

  const theyHaveWhatINeed = intersectNumbers(mine.missing, theirs.duplicates);
  const iHaveWhatTheyNeed = intersectNumbers(mine.duplicates, theirs.missing);

  if (theyHaveWhatINeed.length === 0 && iHaveWhatTheyNeed.length === 0) {
    return null;
  }

  return {
    user: theirProfile,
    theyHaveWhatINeed,
    iHaveWhatTheyNeed,
    score: theyHaveWhatINeed.length + iHaveWhatTheyNeed.length,
  };
}

export function computeAllMatches(
  currentUserId: string,
  myCollection: UserStickerWithSticker[],
  others: Array<{
    profile: Profile;
    collection: UserStickerWithSticker[];
  }>,
): TradeMatch[] {
  return others
    .map(({ profile, collection }) =>
      computeTradeMatch(currentUserId, myCollection, collection, profile),
    )
    .filter((match): match is TradeMatch => match !== null)
    .sort((a, b) => b.score - a.score);
}
