import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhotoUploader } from './components/PhotoUploader';
import { AnalysisLoading } from './components/AnalysisLoading';
import { ReportView } from './components/ReportView';
import { CelebrityCatalogModal } from './components/CelebrityCatalogModal';
import { ShareModal } from './components/ShareModal';
import { HistoryModal } from './components/HistoryModal';
import { VisagismReport } from './types/visagism';
import { DEMO_PRESETS } from './data/celebrities';
import {
  saveDiagnosisToHistory,
  getDiagnosisHistory,
  deleteDiagnosisFromHistory,
  clearDiagnosisHistory,
} from './utils/historyStorage';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<VisagismReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [currentClientName, setCurrentClientName] = useState<string>('Cliente VIP');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCelebrityCatalogOpen, setIsCelebrityCatalogOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<VisagismReport[]>([]);

  const [lastParams, setLastParams] = useState<{
    images: { data: string; mimeType: string }[];
    country: string;
    clientName: string;
    notes: string;
  } | null>(null);

  useEffect(() => {
    setHistoryList(getDiagnosisHistory());
  }, []);

  const handleStartAnalysis = async (
    images: { data: string; mimeType: string }[],
    country: string,
    clientName: string,
    notes: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentClientName(clientName || 'Cliente VIP');
    setPreviewImage(images[0]?.data);
    setLastParams({ images, country, clientName, notes });

    try {
      const response = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images,
          country: country || 'Argentina',
          clientName: clientName || 'Cliente VIP',
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || result.details || 'Error al procesar el análisis facial.');
      }

      const basePreset = DEMO_PRESETS[0];
      const data = result.data || {};

      const generatedReport: VisagismReport = {
        id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        clientName: clientName || data.clientName || 'Cliente VIP',
        countryReference: country || data.countryReference || 'Argentina',
        analysisDate: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        uploadedImages: images.map((img) => img.data),
        morphology: {
          faceShape: data.morphology?.faceShape || basePreset.morphology.faceShape,
          faceShapeDescription:
            data.morphology?.faceShapeDescription || basePreset.morphology.faceShapeDescription,
          proportionsAnalysis:
            data.morphology?.proportionsAnalysis || basePreset.morphology.proportionsAnalysis,
          keyFacialFeatures:
            Array.isArray(data.morphology?.keyFacialFeatures) &&
            data.morphology.keyFacialFeatures.length > 0
              ? data.morphology.keyFacialFeatures
              : basePreset.morphology.keyFacialFeatures,
          jawlineAndCheekbones:
            data.morphology?.jawlineAndCheekbones || basePreset.morphology.jawlineAndCheekbones,
        },
        colorimetry: {
          skinUndertone: data.colorimetry?.skinUndertone || basePreset.colorimetry.skinUndertone,
          undertoneTemperature:
            data.colorimetry?.undertoneTemperature || basePreset.colorimetry.undertoneTemperature,
          undertoneExplanation:
            data.colorimetry?.undertoneExplanation || basePreset.colorimetry.undertoneExplanation,
          seasonalPalette:
            data.colorimetry?.seasonalPalette || basePreset.colorimetry.seasonalPalette,
          currentHairDetected:
            data.colorimetry?.currentHairDetected || basePreset.colorimetry.currentHairDetected,
          recommendedJewelryAndClothing:
            data.colorimetry?.recommendedJewelryAndClothing ||
            basePreset.colorimetry.recommendedJewelryAndClothing,
        },
        recommendedHairColors:
          Array.isArray(data.recommendedHairColors) && data.recommendedHairColors.length > 0
            ? data.recommendedHairColors
            : basePreset.recommendedHairColors,
        colorsToAvoid:
          Array.isArray(data.colorsToAvoid) && data.colorsToAvoid.length > 0
            ? data.colorsToAvoid
            : basePreset.colorsToAvoid,
        recommendedHaircuts:
          Array.isArray(data.recommendedHaircuts) && data.recommendedHaircuts.length > 0
            ? data.recommendedHaircuts
            : basePreset.recommendedHaircuts,
        celebrityReferences:
          Array.isArray(data.celebrityReferences) && data.celebrityReferences.length > 0
            ? data.celebrityReferences
            : basePreset.celebrityReferences,
        salonExecutiveSummary: data.salonExecutiveSummary || basePreset.salonExecutiveSummary,
      };

      setReport(generatedReport);

      // Save to persistent history
      const updatedHistory = await saveDiagnosisToHistory(generatedReport);
      setHistoryList(updatedHistory);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message ||
          'El servicio de análisis está respondiendo con demora. Puedes reintentar o cargar un modelo de demostración instantáneo para el stand.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = async (preset: VisagismReport) => {
    setErrorMessage(null);
    const withId = {
      ...preset,
      id: preset.id || `demo_${Date.now()}`,
      timestamp: preset.timestamp || Date.now(),
    };
    setReport(withId);
    const updatedHistory = await saveDiagnosisToHistory(withId);
    setHistoryList(updatedHistory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (savedReport: VisagismReport) => {
    setReport(savedReport);
    setCurrentClientName(savedReport.clientName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteDiagnosisFromHistory(id);
    setHistoryList(updated);
  };

  const handleClearAllHistory = () => {
    clearDiagnosisHistory();
    setHistoryList([]);
  };

  const handleReset = () => {
    setReport(null);
    setIsLoading(false);
    setErrorMessage(null);
    setPreviewImage(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        onReset={handleReset}
        onOpenCelebrityCatalog={() => setIsCelebrityCatalogOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        historyCount={historyList.length}
        hasReport={!!report}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all duration-300">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-xs sm:text-sm">{errorMessage}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectPreset(DEMO_PRESETS[0])}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition whitespace-nowrap"
              >
                Cargar Demo de Stand
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs border border-stone-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* View Switcher: Loading vs Report vs Uploader */}
        {isLoading ? (
          <AnalysisLoading previewImage={previewImage} clientName={currentClientName} />
        ) : report ? (
          <ReportView
            report={report}
            onNewAnalysis={handleReset}
            onOpenCelebrityCatalog={() => setIsCelebrityCatalogOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        ) : (
          <PhotoUploader
            onStartAnalysis={handleStartAnalysis}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Celebrity Gallery Modal */}
      <CelebrityCatalogModal
        isOpen={isCelebrityCatalogOpen}
        onClose={() => setIsCelebrityCatalogOpen(false)}
      />

      {/* Share / Mobile QR Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        clientName={report?.clientName}
      />

      {/* Diagnosis History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={historyList}
        onSelectReport={handleSelectFromHistory}
        onDeleteReport={handleDeleteHistoryItem}
        onClearHistory={handleClearAllHistory}
      />

      {/* Elegant Stand Footer */}
      <footer className="no-print border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl 2xl:max-w-[1550px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Muestra Técnica 2026 • Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Stand Oficial de Estética & Colorimetría Capilar</span>
            <span>•</span>
            <span>Edición 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
