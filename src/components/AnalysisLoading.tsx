import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, Scissors, Palette, Award, ShieldCheck } from 'lucide-react';

interface AnalysisLoadingProps {
  previewImage?: string;
  clientName: string;
}

const STEPS = [
  { icon: Scan, title: 'Escaneo Morfológico Facial Anatómico', desc: 'Mapeando tercios faciales, ángulos de mandíbula y proporciones óseas...' },
  { icon: Palette, title: 'Diagnóstico Dérmico & Colorimetría', desc: 'Determinando subtono de piel (Cálido, Neutro o Frío) y estación cromática...' },
  { icon: Sparkles, title: 'Formulación Técnica de Salón', desc: 'Calculando numeración de tintes con base y reflejos (.1 a .7) y oxidantes...' },
  { icon: Scissors, title: 'Ingeniería de Corte & Elevación', desc: 'Estableciendo grados de elevación (45°, 90°, 135°) y técnicas de tijera/navaja...' },
  { icon: Award, title: 'Cruce con Celebridades Locales', desc: 'Recuperando referencias fotográficas de figuras conocidas de tu país...' },
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ previewImage, clientName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(10);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => (prev < 95 ? prev + Math.floor(Math.random() * 8) + 2 : 95));
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 space-y-8 animate-fade-in text-center">
      {/* High-tech Face Scan Visualizer */}
      <div className="relative mx-auto w-56 h-72 sm:w-64 sm:h-80 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl shadow-amber-500/20 bg-stone-900 flex items-center justify-center">
        {previewImage ? (
          <img src={previewImage} alt="Scanning" className="w-full h-full object-cover filter brightness-90" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center">
            <Scan className="w-24 h-24 text-amber-400/40 animate-pulse" />
          </div>
        )}

        {/* Laser Scanning Line Animation */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce duration-1000" />

        {/* Anatomical Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        {/* Golden Golden Proportion Arc */}
        <div className="absolute inset-4 border border-dashed border-amber-400/40 rounded-2xl pointer-events-none" />

        <div className="absolute bottom-3 inset-x-3 bg-stone-950/80 backdrop-blur-md rounded-xl py-1.5 px-3 border border-amber-500/30 text-[10px] text-amber-300 font-mono tracking-widest flex items-center justify-between">
          <span>ESCÁNER FACIAL 3D PRO</span>
          <span className="animate-pulse">ANALIZANDO</span>
        </div>
      </div>

      {/* Title & Client */}
      <div className="space-y-2">
        <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-stone-100">
          Analizando a <span className="text-amber-400">{clientName || 'Invitada Especial'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
          Procesando diagnóstico morfofigural, espectrometría de subtono y formulación de colorimetría para el stand.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
          <span className="text-amber-300">{STEPS[currentStepIndex].title}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-stone-900 border border-stone-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 transition-all duration-300 shadow-md shadow-amber-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step by Step Real-Time Card */}
      <div className="max-w-lg mx-auto bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm text-left shadow-xl space-y-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={index}
              className={`flex items-start gap-3.5 transition-all duration-300 ${
                isCurrent
                  ? 'text-amber-300 font-semibold'
                  : isDone
                  ? 'text-stone-400 opacity-80'
                  : 'text-stone-600 opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-amber-400 text-stone-950 animate-pulse'
                    : isDone
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-stone-800 text-stone-600'
                }`}
              >
                {isDone ? <ShieldCheck className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs">{step.title}</p>
                {isCurrent && <p className="text-[11px] text-stone-400 font-normal mt-0.5">{step.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
