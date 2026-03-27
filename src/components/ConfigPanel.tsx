import { useState } from "react";
import { Settings, Eye, EyeOff, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ConfigPanelProps {
  onApply: (config: { apiKey: string; model: string; systemInstructions: string }) => void;
}

const ConfigPanel = ({ onApply }: ConfigPanelProps) => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-3.1-flash-live-preview");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleApply = () => {
    onApply({ apiKey, model, systemInstructions });
    toast({
      title: "Settings Saved",
      description: "Your configuration has been applied.",
    });
  };

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-sidebar p-5 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center gap-2 text-sidebar-foreground">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Configuration</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key" className="text-sm text-muted-foreground">Gemini API Key</Label>
        <div className="relative">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key…"
            className="pr-10 bg-muted border-border font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-id" className="text-sm text-muted-foreground">Model ID</Label>
        <Input
          id="model-id"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-muted border-border font-mono text-sm"
        />
      </div>

      <div className="space-y-2 flex-1 flex flex-col">
        <Label htmlFor="system-instructions" className="text-sm text-muted-foreground">
          Knowledge Base / System Instructions
        </Label>
        <Textarea
          id="system-instructions"
          value={systemInstructions}
          onChange={(e) => setSystemInstructions(e.target.value)}
          placeholder="Paste company policies, support docs, or custom instructions here…"
          className="flex-1 min-h-[200px] bg-muted border-border text-sm resize-none"
        />
      </div>

      <Button onClick={handleApply} className="w-full gap-2">
        <Save className="h-4 w-4" />
        Apply Configuration
      </Button>
    </aside>
  );
};

export default ConfigPanel;
