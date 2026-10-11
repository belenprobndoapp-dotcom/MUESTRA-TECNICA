import jsPDF from 'jspdf';
import { VisagismReport } from '../types/visagism';

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

/**
 * Generate Complete Dossier PDF in EXACTLY 2 PAGES (DOS PÁGINAS BIEN DISTRIBUIDAS).
 * - Information generously distributed across 2 pages so nothing is cramped or squished.
 * - Explanations are larger and clear, with zero overflow from card boundaries.
 * - Report title is smaller, balanced and elegant.
 * - Pure white background (ZERO dark backgrounds).
 * - Exact margins (12mm) and high contrast typography.
 * - Hair recommendation samples and dye formulas clearly separated.
 * - ZERO occurrences of the word "visagismo" or "hoja" in download/prints.
 */
export function generateTwoPageDossierPDF(report: VisagismReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 12;
  const contentWidth = pageWidth - marginX * 2; // 186mm
  const clientName = report.clientName || 'Cliente VIP';
  const sanitizedName = clientName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr =
    report.analysisDate ||
    new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  // =========================================================================
  // =========================== PÁGINA 1 DE 2 ===============================
  // =========================================================================

  // Pure White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = 10;

  // 1. INSTITUTIONAL HEADER BOX (Page 1)
  doc.setFillColor(254, 252, 246); // Ivory
  doc.setDrawColor(217, 119, 6); // Amber border
  doc.setLineWidth(0.5);
  doc.roundedRect(marginX, y, contentWidth, 16, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL • SALADAS, CORRIENTES • MUESTRA TÉCNICA 2026',
    pageWidth / 2,
    y + 4.8,
    { align: 'center' }
  );

  // Smaller Title as requested by user
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(10.5); // Elegant, smaller balanced title
  doc.text('DOSSIER TÉCNICO DE MORFOLOGÍA & COLORIMETRÍA CAPILAR', pageWidth / 2, y + 9.8, {
    align: 'center',
  });

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `MODELO: ${clientName.toUpperCase()}   •   FECHA: ${dateStr}   •   STAND DE ESTILISMO`,
    pageWidth / 2,
    y + 14,
    { align: 'center' }
  );

  y += 19;

  // 2. RESUMEN EJECUTIVO
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 230, 138);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFillColor(217, 119, 6);
  doc.rect(marginX, y, 2.5, 14, 'F');

  doc.setTextColor(120, 53, 15);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  const summaryRaw = sanitizeText(
    report.salonExecutiveSummary || 'Diagnóstico de morfología facial y colorimetría completado.'
  );
  const summaryLines = doc.splitTextToSize(`"${summaryRaw}"`, contentWidth - 10);
  doc.text(summaryLines.slice(0, 2), marginX + 6, y + 5.5);

  y += 17.5;

  // 3. MORFOLOGÍA Y ESTRUCTURA FACIAL (Generous Card)
  const morphCardH = 68;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, morphCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(180, 83, 9);
  doc.rect(marginX, y, 2.5, morphCardH, 'F');

  // Title bar
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1. MORFOLOGÍA FACIAL & ANÁLISIS ANATÓMICO', marginX + 6, y + 6);

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(9.5);
  doc.text(`Rostro Diagnosticado: ${report.morphology?.faceShape || 'En Estudio'}`, marginX + 6, y + 12);

  // Face Description - Larger font (9pt)
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const morphDesc = sanitizeText(report.morphology?.faceShapeDescription || '');
  const descLines = doc.splitTextToSize(morphDesc, contentWidth - 12);
  doc.text(descLines.slice(0, 3), marginX + 6, y + 18);

  // Proportions and Thirds
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX + 6, y + 31, contentWidth - 12, 16, 1, 1, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Proporciones y Tercios Faciales:', marginX + 9, y + 36);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const propClean = sanitizeText(report.morphology?.proportionsAnalysis || '');
  const propLines = doc.splitTextToSize(propClean, contentWidth - 18);
  doc.text(propLines.slice(0, 2), marginX + 9, y + 41);

  // Jawline and features
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  const jawRaw = sanitizeText(report.morphology?.jawlineAndCheekbones || '');
  const jawLines = doc.splitTextToSize(`Línea Mandibular y Pómulos: ${jawRaw}`, contentWidth - 12);
  doc.text(jawLines.slice(0, 2), marginX + 6, y + 53);

  const features = (report.morphology?.keyFacialFeatures || [])
    .map((f) => sanitizeText(f))
    .slice(0, 4)
    .join('  •  ');
  if (features) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Rasgos Observados: ${features}`, marginX + 6, y + 64);
  }

  y += morphCardH + 4;

  // 4. CORTES RECOMENDADOS & TÉCNICA DE TIJERA (Generous Card)
  const cutsCardH = 82;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, cutsCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(2, 132, 199); // Sky blue accent
  doc.rect(marginX, y, 2.5, cutsCardH, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. CORTES RECOMENDADOS & TÉCNICA DE TIJERA EN SALÓN', marginX + 6, y + 6);

  const cuts = (report.recommendedHaircuts || []).slice(0, 2);
  let cutY = y + 12;

  cuts.forEach((cut, idx) => {
    // Cut header
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Corte #${idx + 1}: ${cut.cutName}  (${cut.recommendedLength})`,
      marginX + 6,
      cutY
    );

    // Harmony
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    const harmClean = sanitizeText(cut.visagismHarmony || '');
    const harmLines = doc.splitTextToSize(`Armonía Facial: ${harmClean}`, contentWidth - 12);
    doc.text(harmLines.slice(0, 2), marginX + 6, cutY + 5);

    // Cutting Technique
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const techClean = sanitizeText(cut.technicalCuttingTechnique || '');
    const techLines = doc.splitTextToSize(`Técnica en Salón: ${techClean}`, contentWidth - 12);
    doc.text(techLines.slice(0, 2), marginX + 6, cutY + 14);

    // Styling tip
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    const styleClean = sanitizeText(cut.stylingTips || '');
    const styleLines = doc.splitTextToSize(`Consejo de Peinado / Styling: ${styleClean}`, contentWidth - 12);
    doc.text(styleLines.slice(0, 2), marginX + 6, cutY + 23);

    cutY += 33;
  });

  y += cutsCardH + 4;

  // 5. MUESTRAS DE EJEMPLO DE CABELLOS RECOMENDADOS (Solo Cabellos)
  const hairCardH = 68;
  doc.setFillColor(254, 252, 246);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, hairCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(217, 119, 6);
  doc.rect(marginX, y, 2.5, hairCardH, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3. MUESTRAS DE EJEMPLO DE CABELLOS RECOMENDADOS (TONO & ESTILO)', marginX + 6, y + 6);

  const hairColors = (report.recommendedHairColors || []).slice(0, 3);
  const sampleCardW = (contentWidth - 14) / 3;

  hairColors.forEach((hair, idx) => {
    const sX = marginX + 5 + idx * (sampleCardW + 3);
    const sY = y + 9;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(sX, sY, sampleCardW, 55, 1.5, 1.5, 'FD');

    // Parse hex color for hair swatch
    const hex = hair.hexColor || '#B8860B';
    const r = parseInt(hex.slice(1, 3), 16) || 184;
    const g = parseInt(hex.slice(3, 5), 16) || 134;
    const b = parseInt(hex.slice(5, 7), 16) || 11;

    // Hair swatch block
    doc.setFillColor(r, g, b);
    doc.roundedRect(sX + 3, sY + 3, sampleCardW - 6, 20, 1, 1, 'F');

    // Hair texture lines
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.4);
    doc.line(sX + 6, sY + 8, sX + sampleCardW - 6, sY + 8);
    doc.line(sX + 8, sY + 13, sX + sampleCardW - 8, sY + 13);
    doc.line(sX + 6, sY + 18, sX + sampleCardW - 6, sY + 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('MUESTRA CAPILAR', sX + sampleCardW / 2, sY + 14, { align: 'center' });

    // Hair title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(hair.commercialName, sX + 3, sY + 28, { maxWidth: sampleCardW - 6 });

    // Formula
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`Fórmula: ${hair.technicalFormula}`, sX + 3, sY + 34, { maxWidth: sampleCardW - 6 });

    // Description text
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const effectText =
      idx === 0
        ? 'Reflejo: Brillo miel dimensional'
        : idx === 1
          ? 'Reflejo: Contraste aterciopelado'
          : 'Reflejo: Canela cálida vibrante';
    doc.text(effectText, sX + 3, sY + 41);
    doc.text('Acabado: Brushing con textura', sX + 3, sY + 46);
    doc.text(`Corte sugerido: Capas medias`, sX + 3, sY + 51);
  });

  // PAGE 1 FOOTER
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginX, pageHeight - 9, pageWidth - marginX, pageHeight - 9);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Página 1 de 2  •  Asesoría de Imagen y Morfología Facial  •  Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes',
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  );

  // =========================================================================
  // =========================== PÁGINA 2 DE 2 ===============================
  // =========================================================================
  doc.addPage();

  // Pure White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  y = 10;

  // 1. INSTITUTIONAL HEADER BOX (Page 2)
  doc.setFillColor(254, 252, 246);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.roundedRect(marginX, y, contentWidth, 14, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL • SALADAS, CORRIENTES • MUESTRA TÉCNICA 2026',
    pageWidth / 2,
    y + 4.5,
    { align: 'center' }
  );

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text(
    'COLORIMETRÍA DÉRMICA, FÓRMULAS QUÍMICAS DE SALÓN & ACTA DE CONFORMIDAD',
    pageWidth / 2,
    y + 9.5,
    { align: 'center' }
  );

  y += 17;

  // 2. COLORIMETRÍA DÉRMICA & SUBTONO DE PIEL
  const colCardH = 50;
  const undertoneLower = (report.colorimetry?.skinUndertone || '').toLowerCase();
  let subBg = [255, 251, 235];
  let subBorder = [253, 230, 138];
  let subText = [180, 83, 9];

  if (undertoneLower.includes('frí') || undertoneLower.includes('cool')) {
    subBg = [240, 249, 255];
    subBorder = [186, 230, 253];
    subText = [3, 105, 161];
  } else if (undertoneLower.includes('neutr')) {
    subBg = [236, 253, 245];
    subBorder = [167, 243, 208];
    subText = [4, 120, 87];
  }

  doc.setFillColor(subBg[0], subBg[1], subBg[2]);
  doc.setDrawColor(subBorder[0], subBorder[1], subBorder[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, colCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(subText[0], subText[1], subText[2]);
  doc.rect(marginX, y, 2.5, colCardH, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('4. COLORIMETRÍA DÉRMICA & SUBTONO DE PIEL', marginX + 6, y + 6);

  doc.setTextColor(subText[0], subText[1], subText[2]);
  doc.setFontSize(9.5);
  doc.text(
    `Subtono: ${(report.colorimetry?.skinUndertone || 'Neutro').toUpperCase()} (${report.colorimetry?.undertoneTemperature || 'Equilibrado'})`,
    marginX + 6,
    y + 12
  );

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const underExp = sanitizeText(report.colorimetry?.undertoneExplanation || '');
  const underLines = doc.splitTextToSize(`Justificación: ${underExp}`, contentWidth - 12);
  doc.text(underLines.slice(0, 3), marginX + 6, y + 18);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  const palLines = doc.splitTextToSize(
    `Estación Cromática: ${report.colorimetry?.seasonalPalette || 'Armonía Natural'}   •   Base Previa Detectada: ${report.colorimetry?.currentHairDetected || 'Natural'}`,
    contentWidth - 12
  );
  doc.text(palLines.slice(0, 2), marginX + 6, y + 34);

  if (report.colorimetry?.recommendedJewelryAndClothing) {
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    const jewelClean = sanitizeText(report.colorimetry.recommendedJewelryAndClothing);
    const jewelLines = doc.splitTextToSize(`Accesorios y Vestimenta Sugerida: ${jewelClean}`, contentWidth - 12);
    doc.text(jewelLines.slice(0, 2), marginX + 6, y + 43);
  }

  y += colCardH + 5;

  // 3. FÓRMULAS DE TINTES RECOMENDADOS (NOMENCLATURA PROFESIONAL DE SALÓN)
  const dyesCardH = 88;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, dyesCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(217, 119, 6);
  doc.rect(marginX, y, 2.5, dyesCardH, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('5. FÓRMULAS TÉCNICAS DE TINTES RECOMENDADOS (NOMENCLATURA DE SALÓN)', marginX + 6, y + 6);

  const dyeCardW = (contentWidth - 14) / 3;

  hairColors.forEach((color, idx) => {
    const cardX = marginX + 5 + idx * (dyeCardW + 3);
    const cardY = y + 9;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, cardY, dyeCardW, 75, 1.5, 1.5, 'FD');

    // Color top bar
    doc.setFillColor(217, 119, 6);
    doc.rect(cardX, cardY, dyeCardW, 2.5, 'F');

    // Color name
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${idx + 1} ${color.commercialName}`, cardX + 3, cardY + 7.5);

    // Formula box
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(cardX + 2.5, cardY + 10, dyeCardW - 5, 8, 1, 1, 'F');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    const formulaTrunc =
      color.technicalFormula.length > 28 ? color.technicalFormula.substring(0, 27) + '...' : color.technicalFormula;
    doc.text(formulaTrunc, cardX + 4, cardY + 15.5);

    // Explanatory Details - Clear and bounded
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Base: ${color.baseLevel}`, cardX + 3, cardY + 23);
    doc.text(`Reflejos: ${color.primaryReflect} / ${color.secondaryReflect}`, cardX + 3, cardY + 28);
    doc.text(`Oxidante: ${color.developerVolume}`, cardX + 3, cardY + 33);

    // Technique
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    const techClean = sanitizeText(color.applicationTechnique || '');
    const techLines = doc.splitTextToSize(`Técnica: ${techClean}`, dyeCardW - 6);
    doc.text(techLines.slice(0, 3), cardX + 3, cardY + 39);

    // Why it suits
    doc.setTextColor(120, 53, 15);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    const whyClean = sanitizeText(color.whyItSuits || '');
    const whyLines = doc.splitTextToSize(`"${whyClean}"`, dyeCardW - 6);
    doc.text(whyLines.slice(0, 3), cardX + 3, cardY + 57);
  });

  y += dyesCardH + 5;

  // 4. TONOS QUE DEBE EVITAR (Alertas de Colorimetría)
  const avoidsCardH = 46;
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, avoidsCardH, 1.5, 1.5, 'FD');

  doc.setFillColor(190, 18, 60);
  doc.rect(marginX, y, 2.5, avoidsCardH, 'F');

  doc.setTextColor(159, 18, 57);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('6. TONOS Y REFLEJOS QUE DEBE EVITAR (ALERTAS TÉCNICAS)', marginX + 6, y + 6);

  const avoids = (report.colorsToAvoid || []).slice(0, 2);
  const avoidCardW = (contentWidth - 14) / 2;

  avoids.forEach((avoid, idx) => {
    const aX = marginX + 5 + idx * (avoidCardW + 4);
    const aY = y + 10;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(aX, aY, avoidCardW, 32, 1, 1, 'FD');

    doc.setTextColor(159, 18, 57);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${avoid.toneName}`, aX + 3, aY + 6);

    if (avoid.technicalFormulaAvoid) {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.text(`Fórmula desfavorable: ${avoid.technicalFormulaAvoid}`, aX + 3, aY + 11);
    }

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const reasonClean = sanitizeText(avoid.reasonToAvoid || '');
    const reasonLines = doc.splitTextToSize(reasonClean, avoidCardW - 6);
    doc.text(reasonLines.slice(0, 3), aX + 3, aY + 17);
  });

  y += avoidsCardH + 5;

  // 5. ACTA DE CONFORMIDAD & FIRMAS INSTITUCIONALES
  const signCardH = 34;
  doc.setFillColor(254, 252, 246);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, signCardH, 1.5, 1.5, 'FD');

  const halfSignW = (contentWidth - 16) / 2;

  // Signature line 1
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(marginX + 8, y + 18, marginX + 8 + halfSignW, y + 18);
  doc.line(marginX + 8 + halfSignW + 8, y + 18, marginX + contentWidth - 8, y + 18);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Firma del Estilista Asesor', marginX + 8 + halfSignW / 2, y + 23, { align: 'center' });
  doc.text(`Firma del Modelo / Cliente (${clientName})`, marginX + 16 + halfSignW + halfSignW / 2, y + 23, {
    align: 'center',
  });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Stand Oficial de Estilismo • Escuela Técnica Dr. Juan Gregorio Pujol',
    marginX + 8 + halfSignW / 2,
    y + 27,
    { align: 'center' }
  );
  doc.text(
    'Conformidad de Asesoría Morfológica y Colorimetría Capilar',
    marginX + 16 + halfSignW + halfSignW / 2,
    y + 27,
    { align: 'center' }
  );

  // PAGE 2 FOOTER
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginX, pageHeight - 9, pageWidth - marginX, pageHeight - 9);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Página 2 de 2  •  Documento Oficial de Salón  •  Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes',
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  );

  // SAVE AS PDF (No "hoja" in filename!)
  doc.save(`MuestraTecnica2026_Diagnostico_${sanitizedName}.pdf`);
}

/**
 * Export complete report to PDF in 2 PAGES format.
 */
export async function exportReportToPDF(_elementId: string, report: VisagismReport): Promise<void> {
  generateTwoPageDossierPDF(report);
}

/**
 * Export complete report to JPG in clean, high-contrast, light editorial format.
 */
export async function exportReportToJPG(_elementId: string, report: VisagismReport): Promise<void> {
  const clientName = report.clientName || 'Cliente VIP';
  const sanitizedName = clientName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1750;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Pure White Background (NO BLACK)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Outer Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Header Box (Light ivory with gold border - compact title)
  ctx.fillStyle = '#fefcf6';
  ctx.fillRect(48, 48, width - 96, 140);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(48, 48, width - 96, 140);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ESCUELA TÉCNICA DR. JUAN GREGORIO PUJOL - SALADAS, CORRIENTES', width / 2, 85);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('DOSSIER DE MORFOLOGÍA & COLORIMETRÍA CAPILAR', width / 2, 122);

  ctx.fillStyle = '#475569';
  ctx.font = '15px system-ui, sans-serif';
  const dateStr =
    report.analysisDate ||
    new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  ctx.fillText(`Muestra Técnica 2026  •  MODELO: ${clientName.toUpperCase()}  •  ${dateStr}`, width / 2, 158);

  // Executive summary banner
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(48, 205, width - 96, 70);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 205, width - 96, 70);

  ctx.fillStyle = '#78350f';
  ctx.font = 'italic 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  const sumSnippet = sanitizeText((report.salonExecutiveSummary || '').substring(0, 140));
  ctx.fillText(`"${sumSnippet}..."`, width / 2, 245);

  ctx.textAlign = 'left';

  // Section 1: Morfología Facial
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(48, 295, width - 96, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('1. MORFOLOGÍA Y ANÁLISIS FACIAL', 68, 323);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(`Tipo de Rostro: ${report.morphology?.faceShape || 'En Estudio'}`, 68, 368);

  ctx.fillStyle = '#1e293b';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(sanitizeText((report.morphology?.faceShapeDescription || '').substring(0, 130)) + '...', 68, 398);

  // Section 2: Colorimetría
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(48, 435, width - 96, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('2. ESTUDIO CROMÁTICO Y COLORIMETRÍA DÉRMICA', 68, 463);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(
    `Subtono Dérmico: ${report.colorimetry?.skinUndertone || 'Neutro'} (${report.colorimetry?.undertoneTemperature || 'Equilibrado'})`,
    68,
    508
  );

  ctx.fillStyle = '#1e293b';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(
    `Paleta estacional: ${report.colorimetry?.seasonalPalette || 'Armonía'}  |  Base previa: ${report.colorimetry?.currentHairDetected || 'Natural'}`,
    68,
    538
  );

  // Section 3: Fórmulas de Tintes
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(48, 575, width - 96, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('3. FÓRMULAS DE TINTES RECOMENDADOS (NOMENCLATURA DE SALÓN)', 68, 603);

  let curY = 635;
  (report.recommendedHairColors || []).slice(0, 3).forEach((c, idx) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(48, curY, width - 96, 75);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(48, curY, width - 96, 75);

    ctx.fillStyle = '#d97706';
    ctx.fillRect(48, curY, 6, 75);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(`#${idx + 1} ${c.commercialName}`, 68, curY + 28);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`FÓRMULA: ${c.technicalFormula}`, 480, curY + 28);

    ctx.fillStyle = '#334155';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText(
      `Base: ${c.baseLevel}  |  Reflejos: ${c.primaryReflect} / ${c.secondaryReflect}  |  Oxidante: ${c.developerVolume}`,
      68,
      curY + 54
    );

    curY += 85;
  });

  // Section 4: Muestras de Cabellos Recomendados
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(48, curY + 10, width - 96, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('4. MUESTRAS DE EJEMPLO DE CABELLOS RECOMENDADOS', 68, curY + 38);

  curY += 65;
  const sampleW = (width - 96 - 32) / 3;
  (report.recommendedHairColors || []).slice(0, 3).forEach((c, idx) => {
    const sX = 48 + idx * (sampleW + 16);
    ctx.fillStyle = c.hexColor || '#B8860B';
    ctx.fillRect(sX, curY, sampleW, 110);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(sX, curY, sampleW, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.commercialName, sX + sampleW / 2, curY + 55);
    ctx.font = '14px monospace';
    ctx.fillText(c.technicalFormula, sX + sampleW / 2, curY + 80);
  });

  ctx.textAlign = 'left';
  curY += 135;

  // Section 5: Cortes
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(48, curY, width - 96, 42);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('5. CORTES RECOMENDADOS Y TÉCNICA DE TIJERA', 68, curY + 28);

  curY += 55;
  (report.recommendedHaircuts || []).slice(0, 2).forEach((cut) => {
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText(`• ${cut.cutName} (${cut.recommendedLength})`, 68, curY);

    ctx.fillStyle = '#334155';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText(`Técnica: ${sanitizeText(cut.technicalCuttingTechnique).substring(0, 110)}...`, 68, curY + 26);
    curY += 52;
  });

  // Footer (NO "hoja" mentioned)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Ficha técnica generada para uso profesional de salón • Escuela Técnica Dr. Juan Gregorio Pujol - Saladas, Corrientes',
    width / 2,
    height - 48
  );

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `MuestraTecnica2026_Diagnostico_${sanitizedName}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
