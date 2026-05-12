import { Highlight, SellerProps } from "@/types/seller";

const NEW_SELLER_WINDOW_DAYS = 30;

function getMetadataTags(metadata?: Record<string, unknown> | null): string[] {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const tags = metadata.tags;
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function isFeatured(metadata?: Record<string, unknown> | null): boolean {
  return metadata?.featured === true;
}

function getPopularThreshold(productCounts: Record<string, number>): number {
  const counts = Object.values(productCounts)
    .filter((count) => Number.isFinite(count) && count > 0)
    .sort((a, b) => b - a);

  if (!counts.length) {
    return Number.POSITIVE_INFINITY;
  }

  const topQuartileIndex = Math.floor(counts.length * 0.25);
  return counts[Math.min(topQuartileIndex, counts.length - 1)];
}

function isNewSeller(createdAt?: string): boolean {
  if (!createdAt) {
    return false;
  }

  const createdAtTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdAtTime)) {
    return false;
  }

  const ageInDays = (Date.now() - createdAtTime) / 86_400_000;
  return ageInDays >= 0 && ageInDays <= NEW_SELLER_WINDOW_DAYS;
}

export function computeSellerHighlights(
  sellers: SellerProps[],
  specialties: Record<string, string[]>,
  productCounts: Record<string, number>
): Record<string, Highlight[]> {
  const popularThreshold = getPopularThreshold(productCounts);

  return Object.fromEntries(
    sellers.map((seller) => {
      const metadata = (seller.metadata ?? null) as Record<string, unknown> | null;
      const tags = getMetadataTags(metadata);
      const sellerSpecialties = specialties[seller.handle] || [];
      const highlights: Highlight[] = [];

      if (tags.includes("best_pick") || isFeatured(metadata)) {
        highlights.push("best_pick");
      }

      if (
        Number.isFinite(popularThreshold) &&
        (productCounts[seller.handle] || 0) >= popularThreshold
      ) {
        highlights.push("popular");
      }

      if (isNewSeller(seller.created_at)) {
        highlights.push("new");
      }

      if (
        tags.includes("organic") ||
        sellerSpecialties.some((specialty) => /organic/i.test(specialty))
      ) {
        highlights.push("organic");
      }

      if (seller.is_premium) {
        highlights.push("premium");
      }

      return [seller.handle, highlights];
    })
  );
}
