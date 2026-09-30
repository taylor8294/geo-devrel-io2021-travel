export const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
export const MAP_ID = process.env.GOOGLE_MAPS_MAP_ID as string; // A map ID is a unique identifier that represents Google Map styling and configuration settings that are stored in Google Cloud
export const MAPS_API_VERSION = 'beta';

if (!MAPS_API_KEY || !MAP_ID) {
  throw new Error(`google-maps API-Key and/or MapId are not configured.`);
}
