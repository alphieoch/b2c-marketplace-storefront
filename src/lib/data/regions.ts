'use server';

import { HttpTypes } from '@medusajs/types';

import medusaError from '@/lib/helpers/medusa-error';

import { fetchQuery, sdk } from '../config';
import { getCacheOptions } from './cookies';

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions('regions')),
    revalidate: 3600
  };

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: 'GET',
      next,
      cache: 'force-cache'
    })
    .then(({ regions }) => regions)
    .catch(medusaError);
};

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(['regions', id].join('-'))),
    revalidate: 3600
  };

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: 'GET',
      next,
      cache: 'force-cache'
    })
    .then(({ region }) => region)
    .catch(medusaError);
};

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export const getRegion = async (countryCode: string) => {
  const mapRegionsByCountry = (regions: HttpTypes.StoreRegion[] = []) => {
    regions.forEach(region => {
      region.countries?.forEach(c => {
        regionMap.set((c?.iso_2 ?? '').toLowerCase(), region);
      });
    });
  };

  try {
    const normalizedCountryCode = (countryCode || '').toLowerCase();

    if (regionMap.has(normalizedCountryCode)) {
      return regionMap.get(normalizedCountryCode);
    }

    let regions: HttpTypes.StoreRegion[] | null = null;
    try {
      regions = await listRegions();
    } catch {
      regions = null;
    }

    // Fallback to direct fetch when cached SDK requests fail in runtime.
    if (!regions?.length) {
      const fallback = await fetchQuery('/store/regions', { method: 'GET' });
      regions = fallback.ok ? fallback.data?.regions ?? [] : [];
    }

    if (!regions) {
      return null;
    }

    mapRegionsByCountry(regions);

    const fallbackCountryCode = (process.env.NEXT_PUBLIC_DEFAULT_REGION || 'us').toLowerCase();
    const lookupCountryCode = normalizedCountryCode || fallbackCountryCode;
    let region = regionMap.get(lookupCountryCode);

    // Some SDK responses omit nested countries. If lookup still fails,
    // force a direct API call and rebuild the map from that payload.
    if (!region) {
      const fallback = await fetchQuery('/store/regions', { method: 'GET' });
      if (fallback.ok) {
        mapRegionsByCountry(fallback.data?.regions ?? []);
        region = regionMap.get(lookupCountryCode);
      }
    }

    return region;
  } catch (e: any) {
    return null;
  }
};
