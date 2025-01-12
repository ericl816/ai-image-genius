import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneratedImageProps {
  imageUrl?: string;
  isLoading?: boolean;
}

export function GeneratedImage({ imageUrl, isLoading }: GeneratedImageProps) {
  if (isLoading) {
    return (
      <Card className="w-full aspect-square bg-muted animate-pulse-slow">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Generating...</p>
        </div>
      </Card>
    );
  }

  if (!imageUrl) return null;

  return (
    <Card className="overflow-hidden">
      <img
        src={imageUrl}
        alt="Generated artwork"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </Card>
  );
}