
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  useEffect(() => {
    // Generate QR code using Google Charts API
    if (shareUrl) {
      const encodedUrl = encodeURIComponent(shareUrl);
      setQrCodeUrl(`https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=250x250&choe=UTF-8&chld=L|2`);
    }
  }, [shareUrl]);

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
          <div className="text-sm text-muted-foreground mb-2">Scan QR Code to Join</div>
          <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code for game link" className="w-full h-full" />
            ) : (
              <div className="animate-pulse w-full h-full bg-gray-200"></div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
