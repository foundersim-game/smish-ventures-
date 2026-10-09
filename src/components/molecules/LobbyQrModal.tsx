import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { X, Copy, Check, Share2, Sparkles, QrCode as QrIcon } from "lucide-react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface LobbyQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  joinUrl: string;
}

export const LobbyQrModal: React.FC<LobbyQrModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  joinUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && joinUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        joinUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: "#090310",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR Code:", error);
        }
      );
    }
  }, [isOpen, joinUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    audio.play("click");
    haptics.trigger("light");
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    audio.play("click");
    haptics.trigger("medium");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my CHAOS game!",
          text: `Scan or tap to join room ${roomCode}:`,
          url: joinUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-xs rounded-3xl bg-gradient-to-b from-[#1E0D36] to-[#0E041E] border-2 border-purple-500/50 p-5 shadow-[0_10px_40px_rgba(168,85,247,0.35)] flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            audio.play("click");
            onClose();
          }}
          className="absolute right-3.5 top-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1 text-pink-400 text-xs font-display font-extrabold tracking-wider uppercase">
          <QrIcon className="w-3.5 h-3.5" />
          <span>SCAN TO JOIN</span>
        </div>

        <h3 className="font-display font-black text-xl text-white tracking-tight mb-3">
          ROOM <span className="text-yellow-400 font-mono tracking-widest">{roomCode}</span>
        </h3>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-yellow-400/80 mb-3 flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
        </div>

        {/* Camera instructions */}
        <p className="text-gray-300 text-xs font-medium leading-snug mb-4">
          Point phone camera at the screen to join without typing the link.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-white font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:brightness-110 text-white font-display font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
