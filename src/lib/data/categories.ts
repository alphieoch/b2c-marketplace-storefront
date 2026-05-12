import { HttpTypes } from '@medusajs/types';

import { sdk } from '@/lib/config';

interface CategoriesProps {
  query?: Record<string, unknown>;
}

export const listCategories = async ({ query }: Partial<CategoriesProps> = {}) => {
  const limit = query?.limit || 100;

  const allCategories = await sdk.client
    .fetch<{
      product_categories: HttpTypes.StoreProductCategory[];
    }>('/store/product-categories', {
      query: {
        fields: 'id,handle,name,rank,metadata,parent_category_id,description,*category_children',
        include_descendants_tree: true,
        include_ancestors_tree: true,
        limit,
        ...query
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    })
    .then(({ product_categories }) => product_categories);

  // Filter out deactivated/old fashion categories
  const fashionHandles = new Set(["shirts", "sweatshirts", "pants", "merch", "sneakers", "sandals", "boots", "sport", "accessories"]);
  const activeCategories = allCategories.filter(cat => !fashionHandles.has(cat.handle));

  const parentCategories = activeCategories.filter(cat => !cat.parent_category_id);

  const mainCategories = parentCategories.flatMap(parent => parent.category_children || []);

  const mainCategoriesWithChildren = mainCategories.map(mainCat => {
    const children = activeCategories.filter(cat => cat.parent_category_id === mainCat.id);

    if (children.length > 0) {
      return {
        ...mainCat,
        category_children: children
      };
    }

    return mainCat;
  });

  return {
    parentCategories,
    categories: mainCategoriesWithChildren
  };
};

/** Strips accidental file extensions from route params (e.g. pantry.png → pantry). */
export function normalizeCategoryHandle(handle: string) {
  return handle.replace(/\.(png|jpe?g|webp|gif|svg)$/i, "")
}

export const getCategoryByHandle = async (categoryHandle: string) => {
  const handle = normalizeCategoryHandle(categoryHandle)
  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(`/store/product-categories`, {
      query: {
        fields: '*category_children',
        handle
      },
      cache: 'force-cache',
      next: { revalidate: 300 }
    })
    .then(({ product_categories }) => product_categories[0]);
};
