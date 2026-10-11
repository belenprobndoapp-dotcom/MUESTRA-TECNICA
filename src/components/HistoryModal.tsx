import React, { useState } from 'react';
import {
  X,
  History,
  Search,
  Trash2,
  Download,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  Flame,
  Snowflake,
  Sun,
  FileText,
  Image,
} from 'lucide-react';
import { VisagismReport } from '../types/visagism';
import { exportHistoryToPDF, exportHistoryToJPG } from '../utils/historyStorage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: VisagismReport[];
  onSelectReport: (report: VisagismReport) => void;
  onDeleteReport: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectReport,
  onDeleteReport,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'calido' | 'frio' | 'neutro'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = item.clientName.toLowerCase().includes(query);
    const shapeMatch = item.morphology.faceShape.toLowerCase().includes(query);
    const undertoneMatch = item.colorimetry.skinUndertone.toLowerCase().includes(query);
    const dateMatch = item.analysisDate?.toLowerCase().includes(query) ?? false;
    const matchesSearch = !query || nameMatch || shapeMatch || undertoneMatch || dateMatch;

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    const uLower = item.colorimetry.skinUndertone.toLowerCase();
    if (selectedFilter === 'calido') return uLower.includes('cálid') || uLower.includes('warm');
    if (selectedFilter === 'frio') return uLower.includes('frí') || uLower.includes('cool');
    if (selectedFilter === 'neutro') return uLower.includes('neutr') || uLower.includes('balanced');

    return true;
  });

  const getUndertoneBadge = (undertone: string) => {
    const lower = undertone.toLowerCase();
    if (lower.includes('cálid') || lower.includes('warm')) {
      return {
        icon: Sun,
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        label: 'Cálido',
      };
    } else if (lower.includes('frí') || lower.includes('cool')) {
      return {
        icon: Snowflake,
        color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        label: 'Frío',
      };
    }
    return {
      icon: Flame,
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      label: 'Neutro',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in no-print">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between gap-4 bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Cinzel'] font-bold text-lg sm:text-xl text-stone-100">
                  Historial de Diagnósticos
                </h3>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  {history.length} {history.length === 1 ? 'guardado' : 'guardados'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Registro de clientes y modelos analizados durante la Muestra Técnica 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, rostro o subtono..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-700/80 focus:border-amber-400 text-stone-100 text-xs focus:outline-none transition"
            />
          </div>

          {/* Subtone Filters & Action Buttons */}
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedFilter('calido')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedFilter === 'calido'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Cálido
              </button>
              <button
                onClick={() => setSelectedFilter('frio')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedFilter === 'frio'
                    ? 'bg-sky-500/20 text-sky-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Frío
              </button>
              <button
                onClick={() => setSelectedFilter('neutro')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedFilter === 'neutro'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Neutro
              </button>
            </div>

            {/* Export PDF / JPG History */}
            {history.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => exportHistoryToPDF(filteredHistory)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 hover:text-amber-100 border border-stone-800 hover:border-amber-500/40 text-xs font-medium transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Descargar registro de diagnósticos en formato PDF listo para imprimir"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Descargar PDF</span>
                </button>

                <button
                  onClick={() => exportHistoryToJPG(filteredHistory)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-200 border border-stone-800 hover:border-amber-500/40 text-xs font-medium transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Descargar registro de diagnósticos en formato de imagen JPG"
                >
                  <Image className="w-3.5 h-3.5 text-amber-400" />
                  <span>Descargar JPG</span>
                </button>
              </div>
            )}

            {/* Clear All Button */}
            {history.length > 0 && (
              <>
                {showClearConfirm ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onClearHistory();
                        setShowClearConfirm(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs transition"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 rounded-xl bg-stone-900 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 border border-stone-800 transition"
                    title="Vaciar todo el historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Diagnoses List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 max-h-[60vh]">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-stone-300 font-semibold text-base">
                {history.length === 0
                  ? 'Aún no hay diagnósticos en el historial'
                  : 'No se encontraron diagnósticos para esta búsqueda'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {history.length === 0
                  ? 'Cada vez que analices un rostro en el stand, el informe se almacenará aquí de forma automática para consultarlo, imprimirlo o volver a compartirlo.'
                  : 'Intenta con otro nombre, fecha o cambia los filtros de subtono.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const uBadge = getUndertoneBadge(item.colorimetry.skinUndertone);
              const UIcon = uBadge.icon;
              const topColor = item.recommendedHairColors[0];
              const topCut = item.recommendedHaircuts[0];

              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-stone-800 hover:border-amber-500/40 bg-stone-900/60 hover:bg-stone-900/90 p-4 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  {/* Left: Thumbnail & Client Info */}
                  <div className="flex items-center gap-3.5">
                    {item.uploadedImages && item.uploadedImages[0] ? (
                      <img
                        src={item.uploadedImages[0]}
                        alt={item.clientName}
                        className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <User className="w-7 h-7" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-stone-100 text-sm sm:text-base group-hover:text-amber-200 transition">
                          {item.clientName || 'Cliente Especial'}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          {item.analysisDate}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-lg bg-stone-800 border border-stone-700/80 text-[11px] font-medium text-stone-300">
                          {item.morphology.faceShape.split(' ')[0]}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${uBadge.color}`}
                        >
                          <UIcon className="w-3 h-3" />
                          <span>{uBadge.label}</span>
                        </span>

                        {topColor && (
                          <span className="px-2 py-0.5 rounded-lg bg-stone-800/80 border border-stone-700/60 text-[11px] text-amber-300 flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-white/20 shrink-0"
                              style={{ backgroundColor: topColor.hexColor }}
                            />
                            <span>{topColor.technicalFormula.split(' ')[0] || topColor.commercialName}</span>
                          </span>
                        )}

                        {topCut && (
                          <span className="hidden md:inline px-2 py-0.5 rounded-lg bg-stone-800/60 text-[10px] text-stone-400">
                            {topCut.cutName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
                    <button
                      onClick={() => {
                        onSelectReport(item);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Ver Diagnóstico</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => item.id && onDeleteReport(item.id)}
                      className="p-2 rounded-xl bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 border border-stone-700/60 transition cursor-pointer"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
