import { CreateProjectNearbyPlacesDto } from '../dto/create-project-nearby-places.dto';

/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class ProjectNearbyPlaces {
  /**
   * place type (mosque/mall/school/hospital)
   */
  placeType: string;

  /**
   * name of the place
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * distance unit (500, 1000, 1500, 2000)
   */
  distance: number;

  /**
   * unit distance in (meter, km)
   */
  unitDistance: string;

  public static mapFromCreateRequest(
    request: CreateProjectNearbyPlacesDto,
  ): ProjectNearbyPlaces {
    const nearbyPlaces = new ProjectNearbyPlaces();
    nearbyPlaces.placeType = request.placeType;
    nearbyPlaces.name = request.name;
    nearbyPlaces.description = request.description;
    nearbyPlaces.distance = request.distance;
    nearbyPlaces.unitDistance = request.unitDistance;
    return nearbyPlaces;
  }
}
