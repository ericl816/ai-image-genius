import { useState, useEffect } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { GenerationForm } from "@/components/GenerationForm";
import { GeneratedImage } from "@/components/GeneratedImage";
import { generateImage, checkGenerationStatus, type GenerationResponse } from "@/lib/replicate";
import { toast } from "sonner";

const POLL_INTERVAL = 1000;

export default function Index() {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | undefined>();

  const handleGenerate = async (prompt: string) => {
    if (!apiKey) {
      toast.error("Please enter your Replicate API key");
      return;
    }

    setIsGenerating(true);
    setCurrentImage(undefined);

    try {
      const response = await generateImage(prompt, apiKey);
      await pollGenerationStatus(response, apiKey);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (initialResponse: GenerationResponse, apiKey: string) => {
    let response = initialResponse;

    while (response.status !== "succeeded" && response.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      
      try {
        response = await checkGenerationStatus(response.urls.get, apiKey);
        
        if (response.status === "succeeded" && response.output) {
          setCurrentImage(response.output[0]);
        } else if (response.status === "failed") {
          toast.error("Image generation failed");
        }
      } catch (error) {
        toast.error("Failed to check generation status");
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AI Image Generator</h1>
          <p className="text-muted-foreground">
            Create beautiful artwork using artificial intelligence
          </p>
        </div>

        <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        
        <GenerationForm
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="w-full max-w-2xl mx-auto">
          <GeneratedImage
            imageUrl={currentImage}
            isLoading={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}