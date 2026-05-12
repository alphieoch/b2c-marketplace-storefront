import { searchProducts } from "./products";

export type SellerSpecialtiesResult = {
  specialties: Record<string, string[]>;
  productCounts: Record<string, number>;
};

const MAX_PAGES = 5;
const PER_PAGE = 250;

function normalizeCategoryName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length ? normalized : null;
}

function extractCategoryNames(product: Record<string, any>): string[] {
  const rawCategories = product?.categories;
  if (!Array.isArray(rawCategories)) {
    return [];
  }

  const categoryNames = rawCategories
    .map((category) => normalizeCategoryName(category?.name))
    .filter((name): name is string => Boolean(name));

  return Array.from(new Set(categoryNames));
}

export async function getSellerSpecialties(
  countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ke"
): Promise<SellerSpecialtiesResult> {
  const specialtiesMap = new Map<string, Set<string>>();
  const productCounts: Record<string, number> = {};

  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    let response: Awaited<ReturnType<typeof searchProducts>>;
    try {
      response = await searchProducts({
        page,
        hitsPerPage: PER_PAGE,
        countryCode,
      });
    } catch {
      // Do not fail store listing page when search index/region lookup is unavailable.
      break;
    }

    totalPages = Math.max(response.nbPages || 1, 1);

    for (const product of response.products as Record<string, any>[]) {
      const sellerHandle = product?.seller?.handle;
      if (!sellerHandle) {
        continue;
      }

      const normalizedHandle = String(sellerHandle).trim();
      if (!normalizedHandle) {
        continue;
      }

      productCounts[normalizedHandle] = (productCounts[normalizedHandle] || 0) + 1;

      const categoryNames = extractCategoryNames(product);
      if (!specialtiesMap.has(normalizedHandle)) {
        specialtiesMap.set(normalizedHandle, new Set<string>());
      }

      const specialtySet = specialtiesMap.get(normalizedHandle);
      if (!specialtySet) {
        continue;
      }

      for (const categoryName of categoryNames) {
        specialtySet.add(categoryName);
      }
    }

    page += 1;
  }

  const specialties = Object.fromEntries(
    Array.from(specialtiesMap.entries()).map(([handle, values]) => [
      handle,
      Array.from(values).sort((a, b) => a.localeCompare(b)),
    ])
  );

  return {
    specialties,
    productCounts,
  };
}
