import { VisagismReport } from '../types/visagism';
import jsPDF from 'jspdf';

const STORAGE_KEY = 'auravisage_diagnosis_history_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Generate a compressed thumbnail from an image data URL to save localStorage space
 */
function createThumbnail(dataUrl: string, maxWidth = 180, maxHeight = 180): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl || '');
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Get all stored diagnoses from localStorage
 */
export function getDiagnosisHistory(): VisagismReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Error reading diagnosis history from localStorage:', err);
    return [];
  }
}

/**
 * Save a diagnosis report to history.
 */
export async function saveDiagnosisToHistory(report: VisagismReport): Promise<VisagismReport[]> {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getDiagnosisHistory();
    const id = report.id || `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = report.timestamp || Date.now();
    const formattedDate =
      report.analysisDate ||
      new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    // Compress first uploaded image to thumbnail so it doesn't blow storage quota
    let thumbnailImages = report.uploadedImages;
    if (report.uploadedImages && report.uploadedImages[0]) {
      try {
        const thumb = await createThumbnail(report.uploadedImages[0]);
        thumbnailImages = [thumb];
      } catch {
        thumbnailImages = report.uploadedImages.slice(0, 1);
      }
    }

    const reportToSave: VisagismReport = {
      ...report,
      id,
      timestamp,
      analysisDate: formattedDate,
      uploadedImages: thumbnailImages,
    };

    const filtered = existing.filter((item) => item.id !== id);
    const updated = [reportToSave, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (quotaError) {
      console.warn('LocalStorage quota warning, saving without full images:', quotaError);
      const lightweight = updated.map((item) => ({
        ...item,
        uploadedImages: undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    }

    return updated;
  } catch (err) {
    console.error('Error saving diagnosis to history:', err);
    return getDiagnosisHistory();
  }
}

/**
 * Delete a specific diagnosis by ID
 */
export function deleteDiagnosisFromHistory(id: string): VisagismReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getDiagnosisHistory();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting diagnosis:', err);
    return getDiagnosisHistory();
  }
}

/**
 * Clear the entire diagnosis history
 */
export function clearDiagnosisHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing diagnosis history:', err);
  }
}

/**
 * Export the entire diagnosis history as an official PDF report (Pure white, ink-friendly, legible)
 */
export function exportHistoryToPDF(history: VisagismReport[]): void {
  if (typeof window === 'undefined' || history.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  let y = 16;

  // Pure White Page Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Box (Light cream fill, gold border - NO BLACK)
  doc.setFillColor(254, 252, 246);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.roundedRect(marginX, y, contentWidth, 27, 2, 2, 'FD');

  // Title & Institution
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL', pageWidth / 2, y + 6.5, { align: 'center' });

  doc.setTextColor(15, 23, 42); // Slate-900 (High contrast)
  doc.setFontSize(13);
  doc.text('MUESTRA TÉCNICA 2026 - REGISTRO GENERAL DE DIAGNÓSTICOS', pageWidth / 2, y + 13.5, { align: 'center' });

  doc.setTextColor(71, 85, 105); // Slate-600
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Stand de Morfología Facial, Colorimetría Dérmica y Fórmulas de Salón • Saladas, Corrientes', pageWidth / 2, y + 19, {
    align: 'center',
  });

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const now = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Fecha de emisión: ${now}   •   Total de modelos registrados: ${history.length}`, pageWidth / 2, y + 24, {
    align: 'center',
  });

  y += 33;

  // Table Header (Light Slate Box, Dark Text)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(marginX, y - 5, contentWidth, 8, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  doc.text('#', marginX + 2, y);
  doc.text('Modelo / Cliente', marginX + 10, y);
  doc.text('Fecha', marginX + 56, y);
  doc.text('Rostro', marginX + 90, y);
  doc.text('Subtono', marginX + 118, y);
  doc.text('Tinte Recomendado (Fórmula)', marginX + 142, y);

  y += 6;

  // Table Rows
  history.forEach((item, index) => {
    // Check page break
    if (y > 275) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      y = 18;

      // Repeat Table Header
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.rect(marginX, y - 5, contentWidth, 8, 'FD');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('#', marginX + 2, y);
      doc.text('Modelo / Cliente', marginX + 10, y);
      doc.text('Fecha', marginX + 56, y);
      doc.text('Rostro', marginX + 90, y);
      doc.text('Subtono', marginX + 118, y);
      doc.text('Tinte Recomendado (Fórmula)', marginX + 142, y);
      y += 6;
    }

    // Row alternating background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, y - 4.5, contentWidth, 7.5, 'F');
    }

    // Subtle row bottom divider
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y + 3, marginX + contentWidth, y + 3);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${index + 1}`, marginX + 2, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text((item.clientName || 'Cliente').substring(0, 24), marginX + 10, y);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text((item.analysisDate || '').substring(0, 16), marginX + 56, y);

    doc.setTextColor(180, 83, 9);
    doc.text(item.morphology.faceShape.split(' ')[0], marginX + 90, y);

    doc.setTextColor(3, 105, 161);
    doc.text(item.colorimetry.skinUndertone.split(' ')[0], marginX + 118, y);

    const topColor = item.recommendedHairColors[0]?.technicalFormula || item.recommendedHairColors[0]?.commercialName || '-';
    doc.setTextColor(15, 23, 42);
    doc.text(topColor.substring(0, 26), marginX + 142, y);

    y += 7.5;
  });

  // Footer on last page
  y = Math.min(y + 8, 282);
  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, y, marginX + contentWidth, y);
  y += 5;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Documento oficial generado por la Estación de Diagnóstico en Vivo • Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  doc.save(`MuestraTecnica2026_Historial_Diagnosticos.pdf`);
}

/**
 * Export the entire diagnosis history as an image (JPG - Pure White, High Contrast)
 */
export function exportHistoryToJPG(history: VisagismReport[]): void {
  if (typeof window === 'undefined' || history.length === 0) return;

  const canvas = document.createElement('canvas');
  const width = 1200;
  const rowHeight = 44;
  const headerHeight = 180;
  const footerHeight = 60;
  const totalHeight = headerHeight + history.length * rowHeight + footerHeight;

  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Pure White Background (NO BLACK)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, totalHeight);

  // Outer Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, width - 48, totalHeight - 48);

  // Header Banner (Light ivory/cream with gold border)
  ctx.fillStyle = '#fefcf6';
  ctx.fillRect(36, 36, width - 72, 125);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, 125);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL - SALADAS, CORRIENTES', width / 2, 70);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('MUESTRA TÉCNICA 2026 • REGISTRO GENERAL DE DIAGNÓSTICOS', width / 2, 106);

  ctx.fillStyle = '#475569';
  ctx.font = '14px system-ui, sans-serif';
  const now = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  ctx.fillText(`Estación de Diagnóstico en Vivo  •  ${now}  •  ${history.length} Modelos Atendidos`, width / 2, 138);

  // Table Header (Light Slate Box)
  const tableY = 175;
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(36, tableY, width - 72, 38);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(36, tableY, width - 72, 38);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('#', 52, tableY + 24);
  ctx.fillText('MODELO / CLIENTE', 100, tableY + 24);
  ctx.fillText('FECHA', 370, tableY + 24);
  ctx.fillText('ROSTRO', 530, tableY + 24);
  ctx.fillText('SUBTONO', 690, tableY + 24);
  ctx.fillText('TINTE RECOMENDADO (FÓRMULA)', 850, tableY + 24);

  // Rows
  let curY = tableY + 38;
  history.forEach((item, index) => {
    ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(36, curY, width - 72, rowHeight);

    // Row divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, curY + rowHeight);
    ctx.lineTo(width - 36, curY + rowHeight);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '13px monospace';
    ctx.fillText(String(index + 1), 52, curY + 27);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText((item.clientName || 'Cliente').substring(0, 26), 100, curY + 27);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(item.analysisDate || '', 370, curY + 27);

    ctx.fillStyle = '#b45309';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(item.morphology.faceShape.split(' ')[0], 530, curY + 27);

    ctx.fillStyle = '#0369a1';
    ctx.fillText(item.colorimetry.skinUndertone.split(' ')[0], 690, curY + 27);

    const topColor = item.recommendedHairColors[0]?.technicalFormula || item.recommendedHairColors[0]?.commercialName || '-';
    ctx.fillStyle = '#0f172a';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(topColor.substring(0, 36), 850, curY + 27);

    curY += rowHeight;
  });

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Ficha generada por la Estación de Diagnóstico en Vivo • Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes',
    width / 2,
    totalHeight - 24
  );

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `MuestraTecnica2026_Historial_Diagnosticos.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
