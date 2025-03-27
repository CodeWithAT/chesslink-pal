
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, QrCode } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  onCopyLink: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  onCopyLink,
}: ShareModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share game link</DialogTitle>
          <DialogDescription>
            Anyone with this link can join this game
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="font-mono text-sm"
            />
          </div>
          <Button size="icon" className="shrink-0" onClick={onCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-4 border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">QR Code</div>
          <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
            <QrCode className="h-24 w-24 text-gray-300" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
