import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Sparkles, Users, RefreshCw, Share2, History } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface NavbarProps {
  onReset: () => void;
  onOpenCelebrityCatalog: () => void;
  hasReport: boolean;
  onOpenShare?: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenCelebrityCatalog,
  hasReport,
  onOpenShare,
  onOpenHistory,
  historyCount = 0,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen API error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/85 border-b border-amber-500/20 shadow-2xl no-print">
      <div className="max-w-7xl 2xl:max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={onReset}>
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center p-0.5 overflow-hidden">
              <SchoolLogo className="w-full h-full object-contain" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-stone-950 animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-stone-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] tracking-wider text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                MUESTRA TÉCNICA 2026
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block tracking-wide">
              ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL - SALADAS, CORRIENTES
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Share Button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center justify-center p-2.5 rounded-xl text-amber-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/40 transition-all duration-200 shadow-sm"
              title="Compartir enlace para usar en celulares"
              aria-label="Compartir en celular"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
            </button>
          )}

          {/* History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-300 border border-stone-700/60 hover:border-amber-500/40 transition-all duration-200 shadow-sm cursor-pointer"
              title="Ver historial de diagnósticos guardados"
              aria-label="Historial de diagnósticos"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Historial</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          )}

          {/* Celebrity Catalog Button */}
          <button
            onClick={onOpenCelebrityCatalog}
            className="flex items-center justify-center p-2.5 rounded-xl text-amber-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/40 transition-all duration-200 shadow-sm"
            title="Ver catálogo de referencias y celebridades por país"
            aria-label="Galería de celebridades"
          >
            <Users className="w-4 h-4 text-amber-400" />
          </button>

          {/* Reset / New Analysis Button */}
          {hasReport && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all duration-200"
              title="Iniciar nuevo análisis de modelo"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Análisis</span>
            </button>
          )}

          {/* Fullscreen Expand / Contract Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center p-2.5 rounded-xl text-amber-200 bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 transition-all duration-200 shadow-lg shadow-amber-500/10"
            title={isFullscreen ? 'Contraer pantalla completa' : 'Expandir a pantalla completa para el Stand'}
            aria-label={isFullscreen ? 'Contraer pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-amber-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
