/**
 * Reads optional seller metadata set by vendors/admins.
 * Supported keys: `store_hours` or `active_hours` (plain string), or `weekly_hours` (object of day → range).
 */
export function getSellerStoreHoursDisplay(
  metadata: Record<string, unknown> | null | undefined
): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const storeHours = metadata.store_hours;
  if (typeof storeHours === "string" && storeHours.trim()) {
    return storeHours.trim();
  }

  const activeHours = metadata.active_hours;
  if (typeof activeHours === "string" && activeHours.trim()) {
    return activeHours.trim();
  }

  const weekly = metadata.weekly_hours;
  if (weekly && typeof weekly === "object" && !Array.isArray(weekly)) {
    return formatWeeklyHours(weekly as Record<string, unknown>);
  }

  return null;
}

function daySortKey(key: string): number {
  const k = key.toLowerCase();
  const order: Record<string, number> = {
    sunday: 0,
    sun: 0,
    monday: 1,
    mon: 1,
    tuesday: 2,
    tue: 2,
    wednesday: 3,
    wed: 3,
    thursday: 4,
    thu: 4,
    friday: 5,
    fri: 5,
    saturday: 6,
    sat: 6,
  };
  return order[k] ?? 100;
}

function formatWeeklyHours(raw: Record<string, unknown>): string | null {
  const pairs = Object.entries(raw)
    .filter(([, v]) => typeof v === "string" && String(v).trim())
    .map(([k, v]) => [k.trim(), String(v).trim()] as const);

  if (!pairs.length) {
    return null;
  }

  pairs.sort(([a], [b]) => daySortKey(a) - daySortKey(b));
  return pairs.map(([k, v]) => `${k}: ${v}`).join(" · ");
}
