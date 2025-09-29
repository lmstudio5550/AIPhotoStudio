import { GoogleGenAI, Modality } from "@google/genai";

// Fix: Per Gemini API guidelines, the API key must be obtained from `process.env.API_KEY`.
// We assume it is pre-configured and accessible, so redundant checks are removed.
// A type assertion is used to satisfy TypeScript's type checker.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    const textResponse = response.text;
    if(textResponse) {
        throw new Error(`AI did not return an image. Response: ${textResponse}`);
    }

    throw new Error('No image data found in the API response.');

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to process image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while processing the image.');
  }
};
