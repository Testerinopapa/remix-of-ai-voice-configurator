import { useState } from "react";
import { Settings, Save, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ConfigSectionProps {
  onApply: (config: { model: string; systemInstructions: string; voiceName: string }) => void;
}

const VOICE_OPTIONS = [
  { value: "Kore", label: "Kore", tone: "Firm" },
  { value: "Puck", label: "Puck", tone: "Upbeat" },
  { value: "Charon", label: "Charon", tone: "Informative" },
  { value: "Zephyr", label: "Zephyr", tone: "Bright" },
  { value: "Fenrir", label: "Fenrir", tone: "Excitable" },
  { value: "Leda", label: "Leda", tone: "Youthful" },
  { value: "Orus", label: "Orus", tone: "Firm" },
  { value: "Aoede", label: "Aoede", tone: "Breezy" },
  { value: "Callirrhoe", label: "Callirrhoe", tone: "Easy-going" },
  { value: "Autonoe", label: "Autonoe", tone: "Bright" },
  { value: "Enceladus", label: "Enceladus", tone: "Breathy" },
  { value: "Iapetus", label: "Iapetus", tone: "Clear" },
  { value: "Umbriel", label: "Umbriel", tone: "Easy-going" },
  { value: "Algieba", label: "Algieba", tone: "Smooth" },
  { value: "Despina", label: "Despina", tone: "Smooth" },
  { value: "Erinome", label: "Erinome", tone: "Clear" },
  { value: "Algenib", label: "Algenib", tone: "Gravelly" },
  { value: "Rasalgethi", label: "Rasalgethi", tone: "Informative" },
  { value: "Laomedeia", label: "Laomedeia", tone: "Upbeat" },
  { value: "Achernar", label: "Achernar", tone: "Soft" },
  { value: "Alnilam", label: "Alnilam", tone: "Firm" },
  { value: "Schedar", label: "Schedar", tone: "Even" },
  { value: "Gacrux", label: "Gacrux", tone: "Mature" },
  { value: "Pulcherrima", label: "Pulcherrima", tone: "Forward" },
  { value: "Achird", label: "Achird", tone: "Friendly" },
  { value: "Zubenelgenubi", label: "Zubenelgenubi", tone: "Casual" },
  { value: "Vindemiatrix", label: "Vindemiatrix", tone: "Gentle" },
  { value: "Sadachbia", label: "Sadachbia", tone: "Lively" },
  { value: "Sadaltager", label: "Sadaltager", tone: "Knowledgeable" },
  { value: "Sulafat", label: "Sulafat", tone: "Warm" },
];

const ConfigSection = ({ onApply }: ConfigSectionProps) => {
  const [model] = useState("gemini-3.1-flash-live-preview");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [voiceName, setVoiceName] = useState("Kore");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleApply = () => {
    onApply({ model, systemInstructions, voiceName });
    toast({
      title: "Settings Saved",
      description: "Your configuration has been applied.",
    });
  };

  return (
    <div className="w-full px-4 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Configuration</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-2 rounded-lg bg-accent/30 border border-accent px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-accent-foreground shrink-0" />
            <span className="text-xs text-accent-foreground">
              API Key is securely stored on the backend.
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-name" className="text-sm text-muted-foreground">
              Voice
            </Label>
            <select
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none"
            >
              {VOICE_OPTIONS.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.label} - {voice.tone}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-instructions" className="text-sm text-muted-foreground">
              Knowledge Base / System Instructions
            </Label>
            <Textarea
              id="system-instructions"
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              placeholder="Paste company policies, support docs, or custom instructions here…"
              className="min-h-[120px] bg-muted border-border text-sm resize-none"
            />
          </div>

          <Button onClick={handleApply} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Apply Configuration
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConfigSection;
