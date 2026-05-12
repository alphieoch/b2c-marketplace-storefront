import { SellerProps } from '@/types/seller';

import { sdk } from '../config';

type StoreSeller = SellerProps & {
  logo?: string | null;
  status?: string | null;
};

export const listSellers = async (): Promise<SellerProps[]> => {
  const sellers = await sdk.client
    .fetch<{ sellers: StoreSeller[] }>(`/store/sellers`, {
      query: {
        fields:
          'id,handle,name,description,photo,logo,email,created_at,status,is_premium,metadata,address.city,address.country_code'
      },
      cache: 'no-cache'
    })
    .then(({ sellers }) => sellers)
    .catch(() => []);

  return sellers
    .filter((seller) => Boolean(seller.handle && seller.name))
    .map((seller) => ({
      ...seller,
      photo: seller.photo || seller.logo || '/images/product/seller-avatar.jpg'
    }));
};

export const getSellerByHandle = async (handle: string) => {
  // Query all sellers and find by handle since the API expects ID not handle
  const sellers = await sdk.client
    .fetch<{ sellers: SellerProps[] }>(`/store/sellers`, {
      query: {
        fields:
          'id,handle,name,description,logo,banner,created_at,email,is_premium,metadata,+reviews.seller.name,+reviews.rating,+reviews.customer_note,+reviews.seller_note,+reviews.created_at,+reviews.updated_at,+reviews.customer.first_name,+reviews.customer.last_name'
      },
      cache: 'no-cache'
    })
    .then(({ sellers }) => sellers)
    .catch(() => []);

  const seller = sellers.find((s: SellerProps) => s.handle === handle);
  if (!seller) return null;

  const response = {
    ...seller,
    reviews:
      seller.reviews
        ?.filter(item => item !== null)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)) ?? []
  };

  return response as SellerProps;
};
