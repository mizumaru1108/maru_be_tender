export class InvalidTrackIdException extends Error {
  constructor(trackId: string) {
    super(`Invalid Track Id (${trackId})`);
  }
}
