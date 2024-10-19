import { getHost } from "../util";

export class AiApi {
  async generateDescriptionAI(title: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${getHost()}/ai/description?title=${title}`
        // {
        //   method: "POST",
        //   headers: {
        //     Accept: "*/*",
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      return response.json();
    } catch (error) {
      throw new Error("Error generating description" + error);
    }
  }

  async isAiEnabled(): Promise<boolean> {
    try {
      const response = await fetch(`${getHost()}/ai/`);

      return response.json();
    } catch (error) {
      throw new Error("Error generating description");
    }
  }
}
