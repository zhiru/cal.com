import type { LocationObject } from "@calcom/app-store/locations";
import { getEventLocationType } from "@calcom/app-store/locations";

export const getLocationsWithId = (locations: LocationObject[]) => {
  const locationTypeCount = new Map<string, number>();
  return locations.map((location) => {
    const eventLocation = getEventLocationType(location.type);
    if (!eventLocation) {
      return null;
    }
    const type = eventLocation.type;
    const numOfLocationsWithTheType = (locationTypeCount.get(type) ?? 0) + 1;
    const locationId = numOfLocationsWithTheType;
    locationTypeCount.set(type, numOfLocationsWithTheType);
    return {
      ...location,
      eventLocation: eventLocation,
      id: `${type}:${locationId}`,
    };
  });
};
