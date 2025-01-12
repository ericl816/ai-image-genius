import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function ApiKeyInput({ apiKey, setApiKey }: ApiKeyInputProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Label htmlFor="api-key">Replicate API Key</Label>
      <Input
        id="api-key"
        type="password"
        placeholder="Enter your Replicate API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mt-1"
      />
      <p className="text-sm text-muted-foreground mt-2">
        Get your API key from{" "}
        <a
          href="https://replicate.com/account/api-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Replicate API Tokens
        </a>
      </p>
    </div>
  );
}