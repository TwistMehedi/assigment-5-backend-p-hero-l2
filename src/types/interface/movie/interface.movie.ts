interface ICloudinaryFile {
  url: string;
  public_id: string;
}

export interface IMoviePayload {
  title: string;
  description: string;
  genre: string;
  director: string;
  cast: string;
  duration: string;
  releaseDate: Date;
  isPremium: string;
  price: string;
  thumbnail: ICloudinaryFile;
  poster: ICloudinaryFile;
  video: ICloudinaryFile;
  userId: string;
}
