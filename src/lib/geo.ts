export type UserLocation = {
  countryCode: string;
  city: string;
};

function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function detectUserLocation(): Promise<UserLocation | null> {
  try {
    const position = await getCurrentPosition({
      timeout: 8000,
      enableHighAccuracy: false,
      maximumAge: 300000,
    });

    const endpoint = new URL(
      "https://api.bigdatacloud.net/data/reverse-geocode-client"
    );
    endpoint.searchParams.set("latitude", String(position.coords.latitude));
    endpoint.searchParams.set("longitude", String(position.coords.longitude));
    endpoint.searchParams.set("localityLanguage", "en");

    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const countryCode = String(data?.countryCode || "")
      .trim()
      .toLowerCase();
    const city = String(data?.city || data?.locality || "")
      .trim()
      .toLowerCase();

    if (!countryCode) {
      return null;
    }

    return {
      countryCode,
      city,
    };
  } catch {
    return null;
  }
}
