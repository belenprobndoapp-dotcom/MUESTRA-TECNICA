import React, { useState } from 'react';
import { X, Search, Filter, MapPin, Sparkles, Scissors, Palette, User } from 'lucide-react';
import { CURATED_CELEBRITIES, COUNTRIES, CelebrityShowcase } from '../data/celebrities';

interface CelebrityCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCelebrityLook?: (celebrity: CelebrityShowcase) => void;
}

export const CelebrityCatalogModal: React.FC<CelebrityCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectCelebrityLook,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Todos');
  const [selectedUndertone, setSelectedUndertone] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredCelebrities = CURATED_CELEBRITIES.filter((celeb) => {
    const matchesCountry = selectedCountry === 'Todos' || celeb.country === selectedCountry;
    const matchesUndertone = selectedUndertone === 'Todos' || celeb.undertone.toLowerCase().includes(selectedUndertone.toLowerCase());
    const matchesSearch =
      celeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      celeb.haircutName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      celeb.hairColorFormula.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesUndertone && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in no-print">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-stone-100">
                Galería de Celebridades & Referencias Locales
              </h2>
              <p className="text-xs text-stone-400">
                Muestras fotográficas a color de figuras icónicas de Argentina, Colombia, México, Perú, España y más.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/40 flex flex-wrap items-center gap-3 justify-between">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, corte o fórmula de tinte..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Country filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="Todos">Todos los Países 🌎</option>
              {COUNTRIES.filter((c) => c.id !== 'General').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Undertone filter */}
            <select
              value={selectedUndertone}
              onChange={(e) => setSelectedUndertone(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="Todos">Todos los Subtonos</option>
              <option value="Cálido">Subtono Cálido</option>
              <option value="Frío">Subtono Frío</option>
              <option value="Neutro">Subtono Neutro</option>
            </select>
          </div>
        </div>

        {/* Celebrities Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredCelebrities.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No se encontraron celebridades con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCelebrities.map((celeb) => (
                <div
                  key={celeb.id}
                  className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300 shadow-xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-black">
                    <img
                      src={celeb.imageUrl}
                      alt={celeb.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      {celeb.country}
                    </div>

                    <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-stone-300 border border-stone-700">
                      Subtono {celeb.undertone}
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-left">
                      <h3 className="font-['Cinzel'] text-xl font-bold text-white drop-shadow">
                        {celeb.name}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium">
                        Rostro: {celeb.faceShape}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400">
                        <Scissors className="w-3.5 h-3.5" /> Corte & Técnica:
                      </div>
                      <p className="text-xs text-stone-200 font-medium">{celeb.haircutName}</p>
                      <p className="text-[11px] text-stone-400 leading-tight">{celeb.cuttingTechnique}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-stone-800">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400">
                        <Palette className="w-3.5 h-3.5" /> Fórmula de Color:
                      </div>
                      <p className="text-xs font-mono text-stone-300 bg-stone-950/80 p-2 rounded-lg border border-stone-800">
                        {celeb.hairColorFormula}
                      </p>
                    </div>

                    <p className="text-[11px] text-stone-400 italic pt-1">"{celeb.description}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
