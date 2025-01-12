import { toast } from "sonner";

const REPLICATE_API_URL = "/api/replicate/predictions";

export interface GenerationResponse {
  id: string;
  urls: {
    get: string;
    cancel: string;
  };
  status: "starting" | "processing" | "succeeded" | "failed";
  output?: string[];
  error?: string;
}

export const generateImage = async (prompt: string, apiKey: string): Promise<GenerationResponse> => {
  try {
    const response = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiKey}`,
      },
      body: JSON.stringify({
        version: "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
        input: {
          prompt,
          negative_prompt: "ugly, blurry, low quality, distorted",
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 402) {
        const errorMessage = "Billing setup required. Please visit https://replicate.com/account/billing to set up billing for your Replicate account. After setting up billing, try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw new Error(data.detail || "Failed to generate image");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to generate image");
    }
    throw error;
  }
};

export const checkGenerationStatus = async (
  url: string,
  apiKey: string
): Promise<GenerationResponse> => {
  const proxyUrl = url.replace('https://api.replicate.com/v1', '/api/replicate');

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to check generation status");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};