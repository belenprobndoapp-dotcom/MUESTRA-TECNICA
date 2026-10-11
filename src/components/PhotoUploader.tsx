import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  Trash2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X,
  Scan,
  User,
} from 'lucide-react';
import { VisagismReport } from '../types/visagism';

interface PhotoUploaderProps {
  onStartAnalysis: (images: { data: string; mimeType: string }[], country: string, clientName: string, notes: string) => void;
  onSelectPreset: (preset: VisagismReport) => void;
  isLoading: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onStartAnalysis,
  onSelectPreset,
  isLoading,
}) => {
  const [images, setImages] = useState<{ data: string; mimeType: string; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('Argentina');
  const [clientName, setClientName] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 150);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('No se pudo acceder a la cámara. Por favor autoriza los permisos o sube una imagen desde tu dispositivo.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraCountdown(null);
  };

  const capturePhoto = () => {
    setCameraCountdown(3);
    const interval = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 800);
  };

  const performCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setImages((prev) => [
        ...prev,
        {
          data: dataUrl,
          mimeType: 'image/jpeg',
          name: `Captura en Stand (${new Date().toLocaleTimeString()})`,
        },
      ]);
    }
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [
            ...prev,
            {
              data: event.target!.result as string,
              mimeType: file.type,
              name: file.name,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLaunchAnalysis = () => {
    if (images.length === 0) return;
    onStartAnalysis(
      images.map((img) => ({ data: img.data, mimeType: img.mimeType })),
      selectedCountry,
      clientName.trim() || 'Invitada Especial',
      clientNotes.trim()
    );
  };

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1550px] mx-auto space-y-8 animate-fade-in transition-all duration-300">
      {/* Hero Stand Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900/90 via-stone-950/90 to-stone-950 p-6 sm:p-10 shadow-2xl shadow-black/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="space-y-3 max-w-3xl flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5" /> DIAGNÓSTICO ESTÉTICO
            </div>
            <h1 className="font-['Cinzel'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
              Análisis Facial y{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                Colorimetría
              </span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
              Escanea la morfología facial del modelo, identifica el subtono de piel (cálido, neutro o frío),
              determina fórmulas de tintes con numeración técnica de salón y sugiere cortes con técnica de tijera.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form & Capture Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Capture Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/70 border border-stone-800/80 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Scan className="w-5 h-5 text-amber-400" />
                Foto del Modelo / Cliente
              </h2>
              <span className="text-xs text-stone-400">
                {images.length > 0 ? `${images.length} foto(s) cargada(s)` : 'Soporta 1 o múltiples fotos'}
              </span>
            </div>

            {/* Camera View Mode */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-black aspect-video flex items-center justify-center shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Face Contour Silhouette Guide for Visagism */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 sm:w-56 h-64 sm:h-72 border-2 border-dashed border-amber-400/60 rounded-[50%] flex items-center justify-center">
                    <div className="w-full border-t border-amber-400/30" />
                  </div>
                </div>

                {/* Countdown Overlay */}
                {cameraCountdown !== null && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <span className="font-['Cinzel'] text-8xl font-black text-amber-300 animate-ping">
                      {cameraCountdown}
                    </span>
                  </div>
                )}

                {/* Camera Action Buttons */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-10 px-4">
                  <button
                    onClick={stopCamera}
                    className="p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-700 transition"
                    title="Cancelar cámara"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={cameraCountdown !== null}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold shadow-xl shadow-amber-500/30 transition transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Tomar Foto en Vivo</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone & Buttons */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-stone-700/80 hover:border-amber-500/50 bg-stone-950/50 hover:bg-stone-950/80'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/10">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-stone-100 mb-1">
                  Arrastra o selecciona la(s) foto(s) del modelo
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mb-6">
                  Recomendado: Rostro descubierto con luz frontal para mayor precisión en tercios faciales y tono dérmico.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium border border-stone-600 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Galería / Archivos</span>
                  </button>

                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold border border-amber-500/40 transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Tomar Foto / Cámara</span>
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Thumbnail Gallery Preview */}
            {images.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Fotos listas para el análisis ({images.length})</span>
                  <button
                    onClick={() => setImages([])}
                    className="text-stone-400 hover:text-rose-400 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Limpiar todas
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-amber-500/30 bg-stone-900 aspect-square shadow-md"
                    >
                      <img src={img.data} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeImage(idx)}
                          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-stone-950/80 px-1.5 py-0.5 rounded text-[9px] text-amber-300 font-mono">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Parameters & Client Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/70 border border-stone-800/80 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-sm space-y-5">
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              Datos para el Estilista
            </h2>

            {/* Client Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                Nombre del Modelo o Cliente
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Camila Morales / Invitada VIP"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950/70 border border-stone-700 focus:border-amber-400 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition"
              />
            </div>


            {/* Client Preferences / Stylist Notes */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-300 flex items-center gap-1.5">
                Preferencia o Nota de Estilismo (Opcional)
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                rows={2}
                placeholder="Ej. Prefiere melena media, disimular frente amplia, busca iluminar sin decoloración extrema..."
                className="w-full px-4 py-2 rounded-xl bg-stone-950/70 border border-stone-700 focus:border-amber-400 text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition"
              />
            </div>

            {/* Analysis Checklist */}
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block">
                El Diagnóstico Incluirá:
              </span>
              <ul className="text-xs text-stone-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Morfología facial (tipo de rostro y proporciones)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Subtono dérmico exacto (Cálido / Neutro / Frío)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Tintes recomendados con fórmula y numeración de salón
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Tonos a evitar con justificación técnica
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Técnica de corte (grados de elevación y tijera)
                </li>
              </ul>
            </div>

            {/* Launch Analysis Main Button */}
            <button
              onClick={handleLaunchAnalysis}
              disabled={images.length === 0 || isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                images.length === 0 || isLoading
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 shadow-amber-500/25 active:scale-[0.99] cursor-pointer'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>
                {images.length === 0
                  ? 'Sube o toma una foto para comenzar'
                  : `Analizar Modelo (${images.length} foto${images.length > 1 ? 's' : ''})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
