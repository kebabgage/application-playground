import { getHost } from "../util";

export class ImagesApi {
  getImageUrl(imageName: string): string {
    return `${getHost()}/images/${imageName}`;
  }

  async postImage(image: any): Promise<string> {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(
        `${getHost()}/images?originalFileName=${image.name}`,
        {
          method: "POST",
          body: formData,
        }
      );

      return response.json();
    } catch (error) {
      throw new Error("!");
    }
  }
}
