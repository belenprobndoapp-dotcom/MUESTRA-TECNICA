import React, { useState } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  Scissors,
  Palette,
  AlertTriangle,
  User,
  Users,
  CheckCircle,
  Eye,
  Maximize2,
  Minimize2,
  Calendar,
  Share2,
  Copy,
  Check,
  Flame,
  Snowflake,
  Sun,
  Layers,
  Compass,
  FileText,
  Image,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisagismReport, RecommendedHairColor } from '../types/visagism';
import { exportReportToPDF, exportReportToJPG } from '../utils/pdfGenerator';
import { SchoolLogo } from './SchoolLogo';

interface ReportViewProps {
  report: VisagismReport;
  onNewAnalysis: () => void;
  onOpenCelebrityCatalog: () => void;
  onOpenShare?: () => void;
}

/**
 * Sanitizes any stray occurrences of the word "visagismo" from user-facing text
 */
function sanitizeText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/visagismo/gi, 'morfología facial')
    .replace(/visagista/gi, 'estilista asesor')
    .replace(/visagístico/gi, 'morfológico')
    .replace(/visagística/gi, 'morfológica');
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onNewAnalysis,
  onOpenCelebrityCatalog,
  onOpenShare,
}) => {
  const [showVisagismGuides, setShowVisagismGuides] = useState<boolean>(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [isExportingJPG, setIsExportingJPG] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleDownloadJPG = async () => {
    try {
      setIsExportingJPG(true);
      await exportReportToJPG('printable-visagism-dossier', report);
    } catch (err) {
      console.error('Error generating JPG:', err);
    } finally {
      setIsExportingJPG(false);
    }
  };

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
      });
    } catch {
      // Ignore if confetti fails
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportReportToPDF('printable-visagism-dossier', report);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopySummary = () => {
    const textToCopy = `✨ DOSSIER TÉCNICO DE ASESORÍA & COLORIMETRÍA VIP ✨
Modelo: ${report.clientName}
Tipo de Rostro: ${report.morphology.faceShape}
Subtono de Piel: ${report.colorimetry.skinUndertone} (${report.colorimetry.undertoneTemperature})
Color Recomendado #1: ${report.recommendedHairColors[0]?.commercialName} (${report.recommendedHairColors[0]?.technicalFormula})
Corte Favorecedor: ${report.recommendedHaircuts[0]?.cutName}
Técnica de Corte: ${sanitizeText(report.recommendedHaircuts[0]?.technicalCuttingTechnique)}
Celebridades Referencia: ${report.celebrityReferences.map((c) => c.name).join(', ')}
${sanitizeText(report.salonExecutiveSummary)}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const activeColor: RecommendedHairColor | undefined = report.recommendedHairColors[selectedColorIndex];

  // Helper for Undertone Thermal Badge
  const getUndertoneBadge = (undertone: string) => {
    const lower = undertone.toLowerCase();
    if (lower.includes('cálid') || lower.includes('warm')) {
      return {
        icon: Sun,
        color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40',
        label: 'Subtono Cálido',
      };
    } else if (lower.includes('frí') || lower.includes('cool')) {
      return {
        icon: Snowflake,
        color: 'from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/40',
        label: 'Subtono Frío',
      };
    } else {
      return {
        icon: Flame,
        color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40',
        label: 'Subtono Neutro / Equilibrado',
      };
    }
  };

  const undertoneInfo = getUndertoneBadge(report.colorimetry.skinUndertone);
  const UndertoneIcon = undertoneInfo.icon;

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Top Salon Action Bar */}
      <div className="no-print bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/40 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-inner">
            <SchoolLogo className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Muestra Técnica 2026 • Saladas
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100 mt-0.5">
              Dossier VIP:{' '}
              <span className="text-amber-300 font-['Cinzel'] tracking-wider">
                {report.clientName || 'Invitada Especial'}
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {report.countryReference} • Fecha:{' '}
              {report.analysisDate || new Date().toLocaleDateString('es-ES', { dateStyle: 'medium' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Share to Mobile Button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
              title="Compartir a tu celular por WhatsApp o código QR"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>Compartir en Celular</span>
            </button>
          )}

          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 text-xs font-medium border border-stone-800 hover:border-stone-700 transition flex items-center gap-1.5"
            title="Copiar resumen para WhatsApp o notas"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          {/* Print Button (Clean 2-page print without saying 'hoja') */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 text-xs sm:text-sm font-medium border border-stone-800 hover:border-amber-500/40 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Imprimir informe técnico en papel A4"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Imprimir</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 text-xs sm:text-sm font-semibold border border-amber-500/40 hover:border-amber-400 transition flex items-center gap-2 shadow-sm group cursor-pointer"
            title="Descargar informe técnico en PDF"
          >
            <Download className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            <span>{isExportingPDF ? 'Generando PDF...' : 'Descargar PDF'}</span>
          </button>

          {/* Download JPG Button */}
          <button
            onClick={handleDownloadJPG}
            disabled={isExportingJPG}
            className="px-3.5 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs sm:text-sm font-medium border border-stone-800 hover:border-stone-700 transition flex items-center gap-1.5 shadow-sm group cursor-pointer"
            title="Descargar informe técnico en formato JPG"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isExportingJPG ? 'Generando...' : 'Descargar JPG'}</span>
          </button>
        </div>
      </div>

      {/* Quick Section Anchor Navigation */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pt-2.5 border-t border-stone-800/80 no-scrollbar text-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 shrink-0 mr-1 hidden sm:inline">
          Secciones:
        </span>
        <button
          onClick={() => document.getElementById('sec-morfologia')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <Compass className="w-3 h-3 text-amber-400" />
          <span>Morfología</span>
        </button>
        <button
          onClick={() => document.getElementById('sec-cortes')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <Scissors className="w-3 h-3 text-amber-400" />
          <span>Cortes & Técnica</span>
        </button>
        <button
          onClick={() => document.getElementById('sec-cabellos-ejemplo')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Fotos de Cabello</span>
        </button>
        <button
          onClick={() => document.getElementById('sec-colorimetria')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <Palette className="w-3 h-3 text-amber-400" />
          <span>Colorimetría</span>
        </button>
        <button
          onClick={() => document.getElementById('sec-tintes')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Tintes & Fórmulas</span>
        </button>
        <button
          onClick={() => document.getElementById('sec-evitar')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-2.5 py-1 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-rose-300 border border-stone-800 text-[11px] whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Tonos a Evitar</span>
        </button>
      </div>

      {/* Main Printable Dossier Container */}
      <div id="printable-visagism-dossier" className="space-y-8 bg-stone-950 p-2 sm:p-4 rounded-3xl">
        {/* ========================================================================= */}
        {/* PÁGINA 1 DE IMPRESIÓN: MORFOLOGÍA, CORTES Y MUESTRAS DE CABELLO */}
        {/* ========================================================================= */}
        <div className="print-page-1 space-y-6">
          {/* Official School Header for Printout (Page 1) */}
          <div className="hidden print:block border-2 border-amber-600/40 rounded-2xl p-4 mb-4 bg-amber-50/60">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 shrink-0">
                  <SchoolLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Escuela Técnica Dr. Juan Gregorio Pujol • Saladas, Corrientes
                  </h2>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">
                    Dossier Técnico de Morfología & Colorimetría Capilar VIP
                  </h1>
                  <p className="text-[11px] text-slate-600">
                    Muestra Técnica 2026 • Stand Oficial de Asesoría Integral de Imagen (Página 1 de 2)
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-700 font-mono">
                <p className="font-bold text-slate-900">{report.clientName || 'Cliente VIP'}</p>
                <p>Fecha: {report.analysisDate || new Date().toLocaleDateString('es-ES')}</p>
                <p>Edición Anual 2026</p>
              </div>
            </div>
          </div>

          {/* Salon Header Banner for Screen & Print */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 p-5 sm:p-7 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Certificación de Morfología & Colorimetría Capilar VIP
                </span>
                {/* Smaller title as requested by user */}
                <h1 className="font-['Cinzel'] text-base sm:text-lg font-bold text-stone-100 mt-1">
                  Dossier de Asesoría Integral de Imagen
                </h1>
              </div>

              <div className="text-left sm:text-right text-xs text-stone-400 font-mono">
                <p className="text-stone-300 font-semibold">{report.clientName || 'Cliente VIP'}</p>
                <p>Referencia: {report.countryReference}</p>
                <p>Salón Stand Oficial • Edición 2026</p>
              </div>
            </div>

            {/* Executive Summary Quote - Larger, very legible explanation */}
            <div className="bg-amber-500/5 border-l-4 border-amber-400 p-4 rounded-r-2xl overflow-hidden">
              <p className="text-sm sm:text-base text-stone-100 italic leading-relaxed font-normal">
                "{sanitizeText(report.salonExecutiveSummary)}"
              </p>
            </div>
          </div>

          {/* SECCIÓN 1: MORFOLOGÍA FACIAL */}
          <div id="sec-morfologia" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-36">
            {/* Photo with Overlay (5 cols) */}
            <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Mapeo Morfológico
                </h3>

                <button
                  onClick={() => setShowVisagismGuides(!showVisagismGuides)}
                  className="no-print text-xs text-amber-300 hover:text-amber-200 transition flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showVisagismGuides ? 'Ocultar Guías' : 'Ver Guías 3D'}</span>
                </button>
              </div>

              <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black">
                {report.uploadedImages && report.uploadedImages.length > 0 ? (
                  <img
                    src={report.uploadedImages[0]}
                    alt="Modelo Analizado"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-500">
                    <User className="w-20 h-20 text-stone-700" />
                  </div>
                )}

                {/* Digital Overlay Guides */}
                {showVisagismGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 sm:inset-6 border-2 border-amber-400/70 rounded-[50%] border-dashed shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
                    <div className="absolute inset-y-0 left-1/2 w-0.5 border-l border-amber-300/60" />
                    <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-amber-400/50" />
                    <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-amber-400/50" />
                    <div className="absolute top-2 left-2 text-[9px] font-mono text-amber-300/80 bg-black/60 px-1 rounded">
                      TERCIO SUP
                    </div>
                    <div className="absolute top-1/3 left-2 text-[9px] font-mono text-amber-300/80 bg-black/60 px-1 rounded">
                      TERCIO MED
                    </div>
                    <div className="absolute top-2/3 left-2 text-[9px] font-mono text-amber-300/80 bg-black/60 px-1 rounded">
                      TERCIO INF
                    </div>
                    <div className="absolute bottom-2 right-2 bg-stone-950/80 text-amber-300 px-2 py-0.5 rounded text-[9px] font-mono border border-amber-500/40">
                      SIMETRÍA FACIAL
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full mt-4 p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-center">
                <span className="text-[11px] text-stone-400 uppercase tracking-widest font-bold block mb-1">
                  Tipo de Rostro Diagnosticado
                </span>
                <span className="font-['Cinzel'] text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {report.morphology.faceShape}
                </span>
              </div>
            </div>

            {/* Morphological Analysis Breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-sm space-y-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Scissors className="w-3.5 h-3.5" /> Estudio de Geometría Facial
                </div>
                <h3 className="text-xl font-bold text-stone-100">
                  Análisis Morfológico & Estudio Facial Anatómico
                </h3>
                {/* Explanations: neat, larger font, perfectly contained */}
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed mt-2 font-normal">
                  {sanitizeText(report.morphology.faceShapeDescription)}
                </p>
              </div>

              {/* Proportions and Jawline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-1.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Proporciones y Tercios
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                    {sanitizeText(report.morphology.proportionsAnalysis)}
                  </p>
                </div>

                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-1.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Línea Mandibular & Pómulos
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                    {sanitizeText(report.morphology.jawlineAndCheekbones)}
                  </p>
                </div>
              </div>

              {/* Key Facial Features Tags */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Rasgos Clave Observados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.morphology.keyFacialFeatures.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-stone-800/80 border border-stone-700/80 text-stone-200 text-xs font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      {sanitizeText(feature)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CORTES DE CABELLO FAVORECEDORES & TÉCNICA DE CORTE */}
          <div id="sec-cortes" className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6 scroll-mt-36">
            <div className="border-b border-stone-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Scissors className="w-3.5 h-3.5" /> Arquitectura Capilar
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                Cortes de Cabello Favorecedores & Técnica Profesional de Peluquería
              </h3>
              <p className="text-xs text-stone-400">
                Diseño geométrico para compensar proporciones faciales con grados de elevación y técnica de tijera.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {report.recommendedHaircuts.map((cut, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-amber-500/20 bg-stone-950/70 p-6 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          CORTE RECOMENDADO #{idx + 1} • {cut.recommendedLength}
                        </span>
                        <h4 className="text-lg font-bold text-stone-100">{cut.cutName}</h4>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Scissors className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Harmony with Face Shape */}
                    <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-sm text-stone-200 leading-relaxed overflow-hidden">
                      <span className="font-semibold text-amber-300 block mb-1">
                        Armonía con la Morfología Facial:
                      </span>
                      {sanitizeText(cut.visagismHarmony)}
                    </div>

                    {/* Technical Cutting Technique Breakdown */}
                    <div className="space-y-1.5 overflow-hidden">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Técnica de Corte en Salón:
                      </span>
                      <p className="text-sm text-stone-200 font-mono bg-stone-900/60 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
                        {sanitizeText(cut.technicalCuttingTechnique)}
                      </p>
                    </div>
                  </div>

                  {/* Styling Advice */}
                  <div className="pt-3 border-t border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
                    <span className="font-semibold text-stone-200">Consejo de Peinado / Styling: </span>
                    {sanitizeText(cut.stylingTips)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 3: FOTOS DE EJEMPLO SOLO DE CABELLOS RECOMENDADOS */}
          <div id="sec-cabellos-ejemplo" className="rounded-3xl border border-amber-500/30 bg-stone-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6 scroll-mt-36">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Muestras de Estilo & Colorimetría
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                  Fotos de Ejemplo: Cabellos & Cortes Recomendados
                </h3>
                <p className="text-xs text-stone-400">
                  Muestras fotográficas de referencia técnica con el tono de tinte, reflejo y estilo de corte sugeridos para tu tipo de rostro y piel.
                </p>
              </div>
            </div>

            {/* Grid of Recommended Hair Photos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(report.recommendedHairColors || []).slice(0, 3).map((hairColor, idx) => {
                const hairPhotos = [
                  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                ];
                const cutPairing = report.recommendedHaircuts[idx % (report.recommendedHaircuts.length || 1)]?.cutName || 'Capas Texturizadas';

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-amber-500/30 bg-stone-950/80 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-400 transition-all duration-300"
                  >
                    {/* Photo of Recommended Hair Look */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                      <img
                        src={hairPhotos[idx % hairPhotos.length]}
                        alt={hairColor.commercialName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                      {/* Formula Pill */}
                      <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-lg">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/40"
                          style={{ backgroundColor: hairColor.hexColor || '#B8860B' }}
                        />
                        <span>{hairColor.technicalFormula}</span>
                      </div>

                      <div className="absolute bottom-3 inset-x-3 text-left">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                          Corte: {cutPairing}
                        </span>
                        <h4 className="font-['Cinzel'] text-lg font-bold text-white drop-shadow">
                          {hairColor.commercialName}
                        </h4>
                      </div>
                    </div>

                    {/* Body description */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-stone-300">
                        <span className="text-stone-400">Altura & Reflejo:</span>
                        <span className="font-semibold text-amber-300">
                          {hairColor.baseLevel} ({hairColor.primaryReflect})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-300">
                        <span className="text-stone-400">Oxidante:</span>
                        <span className="font-semibold text-stone-200">{hairColor.developerVolume}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-300 italic">
                        "{sanitizeText(hairColor.whyItSuits)}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page 1 Print Footer */}
          <div className="hidden print:flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-300">
            <span>Página 1 de 2 • Asesoría de Imagen y Morfología Facial</span>
            <span>Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORTE DE PÁGINA EXPLÍCITO PARA IMPRESIÓN (DOS PÁGINAS LIMPIAS) */}
        {/* ========================================================================= */}
        <div className="print-page-break hidden print:block" />

        {/* ========================================================================= */}
        {/* PÁGINA 2 DE IMPRESIÓN: COLORIMETRÍA, TINTES, TONOS A EVITAR Y FIRMAS */}
        {/* ========================================================================= */}
        <div className="print-page-2 space-y-6">
          {/* Official School Header for Printout (Page 2) */}
          <div className="hidden print:block border-2 border-amber-600/40 rounded-2xl p-4 mb-4 bg-amber-50/60">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 shrink-0">
                  <SchoolLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Escuela Técnica Dr. Juan Gregorio Pujol • Saladas, Corrientes
                  </h2>
                  <h1 className="text-base font-bold text-slate-900 leading-tight">
                    Dossier Técnico • Continuación: Colorimetría Dérmica, Fórmulas de Salón & Conformidad
                  </h1>
                  <p className="text-[10px] text-slate-600">
                    Muestra Técnica 2026 • Stand Oficial de Asesoría Integral (Página 2 de 2)
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-700 font-mono">
                <p className="font-bold text-slate-900">{report.clientName || 'Cliente VIP'}</p>
                <p>Fecha: {report.analysisDate || new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: COLORIMETRÍA & SUBTONO DE PIEL */}
          <div id="sec-colorimetria" className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6 scroll-mt-36">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Palette className="w-3.5 h-3.5" /> Estudio Cromático
                </div>
                <h3 className="text-xl font-bold text-stone-100">
                  Diagnóstico de Colorimetría & Subtono de Piel
                </h3>
              </div>

              {/* Undertone Thermal Badge */}
              <div className={`px-4 py-2 rounded-2xl border bg-gradient-to-r ${undertoneInfo.color} flex items-center gap-3 shadow-md`}>
                <UndertoneIcon className="w-6 h-6 shrink-0" />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block">
                    {undertoneInfo.label}
                  </span>
                  <span className="text-[11px] opacity-90 block">
                    {report.colorimetry.undertoneTemperature}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Undertone scientific explanation */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-2 overflow-hidden">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" /> Justificación Dérmica
                </span>
                <p className="text-sm text-stone-200 leading-relaxed font-normal">
                  {sanitizeText(report.colorimetry.undertoneExplanation)}
                </p>
              </div>

              {/* Seasonal Palette */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-2 overflow-hidden">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Estación Cromática
                </span>
                <p className="text-sm sm:text-base font-bold text-stone-100">
                  {report.colorimetry.seasonalPalette}
                </p>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  {sanitizeText(report.colorimetry.recommendedJewelryAndClothing) ||
                    'Favorecen accesorios de metales afines a su temperatura cromática.'}
                </p>
              </div>

              {/* Current Hair Detected */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-2 overflow-hidden">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Color Actual Percibido
                </span>
                <p className="text-sm text-stone-200 leading-relaxed font-normal">
                  {report.colorimetry.currentHairDetected}
                </p>
                <span className="inline-block text-[11px] text-amber-400/90 font-mono">
                  Diagnóstico de base previa para formulación química
                </span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: TINTES RECOMENDADOS CON NUMERACIÓN PROFESIONAL */}
          <div id="sec-tintes" className="rounded-3xl border border-amber-500/30 bg-stone-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6 scroll-mt-36">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Coloración de Alta Peluquería
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                  Tonos de Tintes Recomendados & Nomenclatura Técnica de Salón
                </h3>
                <p className="text-xs text-stone-400">
                  Fórmulas exactas con altura de base (1-10), reflejos primarios/secundarios (.1 a .7) y técnica de aplicación.
                </p>
              </div>

              {/* Quick Swatch Pills */}
              <div className="flex items-center gap-2">
                {report.recommendedHairColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-9 h-9 rounded-full border-2 transition-transform shadow-lg relative ${
                      selectedColorIndex === idx
                        ? 'scale-125 border-amber-300 shadow-amber-500/50'
                        : 'border-stone-700 opacity-80 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hexColor }}
                    title={color.commercialName}
                  >
                    {selectedColorIndex === idx && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards of Recommended Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.recommendedHairColors.map((color, idx) => {
                const isSelected = selectedColorIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-stone-950/90 border-amber-400/80 shadow-2xl shadow-amber-500/20 scale-[1.02]'
                        : 'bg-stone-950/50 border-stone-800 hover:border-amber-500/40 hover:bg-stone-950/70'
                    }`}
                  >
                    {/* Top Header with Color Swatch Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl shadow-inner border border-white/20 shrink-0"
                            style={{ backgroundColor: color.hexColor }}
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                              OPCIÓN #{idx + 1}
                            </span>
                            <h4 className="font-bold text-sm text-stone-100 leading-tight">
                              {color.commercialName}
                            </h4>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                            ACTIVO
                          </span>
                        )}
                      </div>

                      {/* Technical Formula Box */}
                      <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5 font-mono">
                        <div className="text-[11px] text-amber-300 font-bold flex items-center justify-between">
                          <span>FÓRMULA SALÓN:</span>
                          <span className="text-stone-400 text-[10px]">{color.developerVolume}</span>
                        </div>
                        <p className="text-xs text-stone-200 font-semibold">{color.technicalFormula}</p>
                        <div className="text-[10px] text-stone-400 flex items-center gap-2 pt-1 border-t border-stone-800">
                          <span>Base: {color.baseLevel}</span>
                          <span>•</span>
                          <span>Reflejo: {color.primaryReflect}</span>
                        </div>
                      </div>

                      {/* Technique of Application */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                          Técnica de Aplicación:
                        </span>
                        <p className="text-sm text-stone-200 leading-relaxed font-normal">
                          {sanitizeText(color.applicationTechnique)}
                        </p>
                      </div>

                      {/* Why It Suits */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                          Por qué le Favorece:
                        </span>
                        <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                          "{sanitizeText(color.whyItSuits)}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 6: TONOS QUE DEBE EVITAR */}
          <div id="sec-evitar" className="rounded-3xl border border-rose-500/30 bg-stone-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-5 scroll-mt-36">
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  Tonos y Reflejos que Debe Evitar
                </h3>
                <p className="text-xs text-stone-400">
                  Colores desfavorables que apagan el subtono de piel o endurecen las facciones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.colorsToAvoid.map((avoid, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950/70 border border-rose-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 border border-rose-500/40 relative flex items-center justify-center shadow-md"
                    style={{ backgroundColor: avoid.hexColor }}
                  >
                    <div className="w-7 h-0.5 bg-rose-500 transform rotate-45" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-rose-200">{avoid.toneName}</h4>
                    {avoid.technicalFormulaAvoid && (
                      <span className="text-[10px] font-mono text-stone-400 block">
                        Fórmula desfavorable: {avoid.technicalFormulaAvoid}
                      </span>
                    )}
                    <p className="text-xs text-stone-400 leading-relaxed font-light">
                      {sanitizeText(avoid.reasonToAvoid)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Print-only Official Signatures & Institutional Stamp (Page 2) */}
          <div className="hidden print:block pt-6 border-t border-slate-300 mt-6 break-inside-avoid">
            <div className="grid grid-cols-2 gap-10 text-center text-xs text-slate-700 pt-6">
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900 text-sm">Firma del Estilista Asesor</p>
                <p className="text-[11px] text-slate-500">Stand Oficial de Estilismo & Colorimetría • Muestra Técnica 2026</p>
                <p className="text-[11px] text-slate-500">Escuela Técnica Dr. Juan Gregorio Pujol</p>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900 text-sm">Firma del Modelo / Cliente</p>
                <p className="text-[11px] text-slate-500 font-semibold">{report.clientName || 'Cliente VIP'}</p>
                <p className="text-[11px] text-slate-500">Conformidad de Asesoría de Imagen y Colorimetría</p>
              </div>
            </div>
          </div>

          {/* Page 2 Print Footer */}
          <div className="hidden print:flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-300">
            <span>Página 2 de 2 • Documento Oficial de Salón</span>
            <span>Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes</span>
          </div>
        </div>

        {/* Stand VIP Footer Signoff (Visible on Screen) */}
        <div className="no-print rounded-2xl border border-stone-800/80 bg-stone-950/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1 overflow-hidden shrink-0">
              <SchoolLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-200">
                Muestra Técnica 2026 • Escuela Técnica Dr. Juan Gregorio Pujol
              </h4>
              <p className="text-xs text-stone-400">
                Diagnóstico completado con éxito. Puedes descargar el informe en PDF listo para imprimir.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Share to Mobile Button in Footer */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
                title="Compartir a tu celular por WhatsApp o código QR"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>Compartir en Celular</span>
              </button>
            )}

            {/* Print Button (Clean label, no 'hoja') */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 text-xs sm:text-sm font-medium border border-stone-800 hover:border-amber-500/40 transition flex items-center gap-2 shadow-sm cursor-pointer"
              title="Imprimir informe técnico en papel A4"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir</span>
            </button>

            {/* Download PDF button (Clean label, no 'hoja') */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 text-xs sm:text-sm font-semibold border border-amber-500/40 hover:border-amber-400 transition flex items-center gap-2 shadow-sm cursor-pointer"
              title="Descargar informe en formato PDF listo para imprimir"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isExportingPDF ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>

            {/* Download JPG button (Clean label, no 'hoja') */}
            <button
              onClick={handleDownloadJPG}
              disabled={isExportingJPG}
              className="px-3.5 py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs sm:text-sm font-medium border border-stone-800 hover:border-stone-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Descargar informe como imagen JPG"
            >
              <Image className="w-4 h-4 text-amber-400" />
              <span>{isExportingJPG ? 'Generando...' : 'Descargar JPG'}</span>
            </button>

            <button
              onClick={onNewAnalysis}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs sm:text-sm font-medium border border-stone-700/80 transition"
            >
              Nuevo Diagnóstico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
