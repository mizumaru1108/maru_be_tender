import { CreateProjectNearbyPlacesDto } from '../dto/create-project-nearby-places.dto';

/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class ProjectNearbyPlaces {
  placeType: string;
  name: string;
  distance: number;

  public static mapFromCreateRequest(
    request: CreateProjectNearbyPlacesDto,
  ): ProjectNearbyPlaces {
    const nearbyPlaces = new ProjectNearbyPlaces();
    nearbyPlaces.placeType = request.placeType;
    nearbyPlaces.name = request.name;
    nearbyPlaces.distance = request.distance;
    return nearbyPlaces;
  }
}
