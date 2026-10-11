import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, QrCode, Smartphone, ExternalLink, Send } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  clientName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title = 'Muestra Técnica 2026 - Análisis Facial y Colorimetría',
  clientName,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      setShareUrl(currentUrl);

      // Generate QR Code data URL
      QRCode.toDataURL(currentUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0c0a09',
          light: '#f59e0b',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shareText = clientName
    ? `✨ Hola! Te comparto mi diagnóstico de Morfología Facial y Colorimetría Capilar (${clientName}) de la Muestra Técnica 2026 de la Escuela Técnica Dr. Juan Gregorio Pujol: ${shareUrl}`
    : `✨ Te invito a probar la app de Análisis Facial y Colorimetría de la Muestra Técnica 2026 - Escuela Técnica Dr. Juan Gregorio Pujol: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in no-print">
      <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Cinzel'] font-bold text-base sm:text-lg text-stone-100">
                Usar en Celular
              </h3>
              <p className="text-[11px] text-stone-400">
                Comparte o abre la app directamente en tu teléfono
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 text-center">
          <div className="p-2.5 rounded-2xl bg-amber-400 shadow-xl shadow-amber-500/10">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Escanear en Celular" className="w-48 h-48 rounded-xl object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-stone-950 rounded-xl">
                <QrCode className="w-12 h-12 text-amber-400 animate-pulse" />
              </div>
            )}
          </div>
          <p className="text-xs text-stone-300 font-medium">
            Apunta la cámara de tu celular para abrirlo al instante
          </p>
          <span className="text-[10px] text-amber-400/80 font-mono">
            Optimizado para Android & iOS
          </span>
        </div>

        {/* Action Buttons for Mobile Sharing */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Compartir por WhatsApp</span>
          </button>

          {/* Native Mobile Share if supported */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Abrir Menú de Compartir del Celular</span>
            </button>
          )}

          {/* Copy URL Button */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 select-all font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
