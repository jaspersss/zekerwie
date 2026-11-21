(() => {
  const MM_TO_PT = 72 / 25.4;
  const A4_W_MM = 210;
  const A4_H_MM = 297;
  const A6_W_MM = 105;
  const A6_H_MM = 148.5;

  let currentPageH_Pt = A4_H_MM * MM_TO_PT;

  const mm = (v) => (v * MM_TO_PT).toFixed(3);
  const yTop = (v) => (currentPageH_Pt - v * MM_TO_PT).toFixed(3);

  function pdfEscape(str) {
    let out = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const code = str.charCodeAt(i);
      if (ch === "\\" || ch === "(" || ch === ")") {
        out += "\\" + ch;
      } else if (code === 0x2013) {
        out += "\\226";
      } else if (code === 0x2014) {
        out += "\\227";
      } else if (code === 0x2018 || code === 0x2019) {
        out += "'";
      } else if (code === 0x201c || code === 0x201d) {
        out += '\\"';
      } else if (code >= 0x80 && code <= 0xff) {
        out += "\\" + code.toString(8).padStart(3, "0");
      } else if (code > 0xff) {
        out += "?";
      } else {
        out += ch;
      }
    }
    return out;
  }

  function drawText(cmds, font, sizePt, xMm, yMmFromTop, text, align = "left", rgb = [0, 0, 0]) {
    const safe = pdfEscape(text);
    cmds.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
    cmds.push(`BT /${font} ${sizePt.toFixed(2)} Tf`);
    if (align === "center") {
      const avgWidthFactor = font === "F3" ? 0.6 : 0.5;
      const estW = text.length * sizePt * avgWidthFactor;
      const xPt = xMm * MM_TO_PT - estW / 2;
      cmds.push(`1 0 0 1 ${xPt.toFixed(3)} ${yTop(yMmFromTop)} Tm (${safe}) Tj ET`);
    } else if (align === "right") {
      const avgWidthFactor = font === "F3" ? 0.6 : 0.48;
      const estW = text.length * sizePt * avgWidthFactor;
      const xPt = xMm * MM_TO_PT - estW;
      cmds.push(`1 0 0 1 ${xPt.toFixed(3)} ${yTop(yMmFromTop)} Tm (${safe}) Tj ET`);
    } else {
      cmds.push(`1 0 0 1 ${mm(xMm)} ${yTop(yMmFromTop)} Tm (${safe}) Tj ET`);
    }
  }

  function drawRect(cmds, xMm, yMmTop, wMm, hMm, fillRgb = null, strokeRgb = null, lineWidthMm = 0.2) {
    const yBottom = currentPageH_Pt - (yMmTop + hMm) * MM_TO_PT;
    cmds.push("q");
    if (fillRgb) cmds.push(`${fillRgb[0]} ${fillRgb[1]} ${fillRgb[2]} rg`);
    if (strokeRgb) {
      cmds.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
      cmds.push(`${mm(lineWidthMm)} w`);
    }
    cmds.push(`${mm(xMm)} ${yBottom.toFixed(3)} ${mm(wMm)} ${mm(hMm)} re`);
    if (fillRgb && strokeRgb) cmds.push("B");
    else if (fillRgb) cmds.push("f");
    else if (strokeRgb) cmds.push("S");
    cmds.push("Q");
  }

  function drawLine(cmds, x1Mm, y1Mm, x2Mm, y2Mm, strokeRgb = [0, 0, 0], lineWidthMm = 0.2, dashed = false) {
    cmds.push("q");
    cmds.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
    cmds.push(`${mm(lineWidthMm)} w`);
    if (dashed) cmds.push("[3 3] 0 d");
    cmds.push(`${mm(x1Mm)} ${yTop(y1Mm)} m ${mm(x2Mm)} ${yTop(y2Mm)} l S`);
    cmds.push("Q");
  }

  function drawIcon(cmds, name, cxMm, cyMm, sMm) {
    const u = (nx) => ((cxMm + (nx - 12) * (sMm / 24)) * MM_TO_PT).toFixed(3);
    const v = (ny) => (currentPageH_Pt - (cyMm + (ny - 12) * (sMm / 24)) * MM_TO_PT).toFixed(3);
    const circle = (cx, cy, r) => {
      const k = 0.55228475 * r;
      cmds.push(`${u(cx + r)} ${v(cy)} m`);
      cmds.push(`${u(cx + r)} ${v(cy + k)} ${u(cx + k)} ${v(cy + r)} ${u(cx)} ${v(cy + r)} c`);
      cmds.push(`${u(cx - k)} ${v(cy + r)} ${u(cx - r)} ${v(cy + k)} ${u(cx - r)} ${v(cy)} c`);
      cmds.push(`${u(cx - r)} ${v(cy - k)} ${u(cx - k)} ${v(cy - r)} ${u(cx)} ${v(cy - r)} c`);
      cmds.push(`${u(cx + k)} ${v(cy - r)} ${u(cx + r)} ${v(cy - k)} ${u(cx + r)} ${v(cy)} c S`);
    };

    cmds.push("q 0.06 0.09 0.16 RG 0.65 w 1 J 1 j");
    switch (name) {
      case "Auto":
        cmds.push(`${u(4.5)} ${v(16.5)} m ${u(2.5)} ${v(16.5)} l ${u(2.5)} ${v(12.5)} l ${u(5.5)} ${v(11.5)} l ${u(8)} ${v(7)} l ${u(15)} ${v(7)} l ${u(18)} ${v(11.5)} l ${u(21.5)} ${v(12.5)} l ${u(21.5)} ${v(16.5)} l ${u(19.5)} ${v(16.5)} l S`);
        cmds.push(`${u(9)} ${v(16.5)} m ${u(15)} ${v(16.5)} l S`);
        cmds.push(`${u(6)} ${v(11.5)} m ${u(17.5)} ${v(11.5)} l ${u(11.5)} ${v(7)} m ${u(11.5)} ${v(11.5)} l S`);
        circle(6.8, 16.5, 2.2);
        circle(17.2, 16.5, 2.2);
        break;
      case "Appel":
        cmds.push(`${u(12)} ${v(6.5)} m ${u(8.5)} ${v(5)} ${u(5)} ${v(7.5)} ${u(5)} ${v(11.5)} c ${u(5)} ${v(16.5)} ${u(8)} ${v(21)} ${u(10.5)} ${v(21)} c ${u(11.5)} ${v(21)} ${u(12)} ${v(20.2)} ${u(12)} ${v(20.2)} c ${u(12)} ${v(20.2)} ${u(12.5)} ${v(21)} ${u(13.5)} ${v(21)} c ${u(16)} ${v(21)} ${u(19)} ${v(16.5)} ${u(19)} ${v(11.5)} c ${u(19)} ${v(7.5)} ${u(15.5)} ${v(5)} ${u(12)} ${v(6.5)} c S`);
        cmds.push(`${u(12)} ${v(6.5)} m ${u(12.5)} ${v(3.5)} ${u(15)} ${v(2.5)} ${u(16)} ${v(2.5)} c S`);
        break;
      case "Huis":
        cmds.push(`${u(3)} ${v(10.5)} m ${u(12)} ${v(3)} l ${u(21)} ${v(10.5)} l S`);
        cmds.push(`${u(5)} ${v(9.5)} m ${u(5)} ${v(20)} l ${u(19)} ${v(20)} l ${u(19)} ${v(9.5)} l S`);
        cmds.push(`${u(10)} ${v(20)} m ${u(10)} ${v(14)} l ${u(14)} ${v(14)} l ${u(14)} ${v(20)} l S`);
        break;
      case "Sleutel":
        circle(7.5, 12, 4);
        cmds.push(`${u(11.5)} ${v(12)} m ${u(21)} ${v(12)} l S`);
        cmds.push(`${u(17)} ${v(12)} m ${u(17)} ${v(15.5)} l S`);
        cmds.push(`${u(20)} ${v(12)} m ${u(20)} ${v(14.5)} l S`);
        break;
      case "Zon":
        circle(12, 12, 4);
        cmds.push(`${u(12)} ${v(2)} m ${u(12)} ${v(5)} l ${u(12)} ${v(19)} m ${u(12)} ${v(22)} l ${u(2)} ${v(12)} m ${u(5)} ${v(12)} l ${u(19)} ${v(12)} m ${u(22)} ${v(12)} l S`);
        cmds.push(`${u(4.9)} ${v(4.9)} m ${u(7)} ${v(7)} l ${u(17)} ${v(17)} m ${u(19.1)} ${v(19.1)} l ${u(4.9)} ${v(19.1)} m ${u(7)} ${v(17)} l ${u(17)} ${v(7)} m ${u(19.1)} ${v(4.9)} l S`);
        break;
      case "Hart":
        cmds.push(`${u(12)} ${v(20.5)} m ${u(5)} ${v(15.8)} ${u(2.8)} ${v(11.3)} ${u(2.8)} ${v(8.2)} c ${u(2.8)} ${v(5)} ${u(5.2)} ${v(3.5)} ${u(7.5)} ${v(3.5)} c ${u(9.6)} ${v(3.5)} ${u(11.2)} ${v(4.8)} ${u(12)} ${v(6.4)} c ${u(12.8)} ${v(4.8)} ${u(14.4)} ${v(3.5)} ${u(16.5)} ${v(3.5)} c ${u(18.8)} ${v(3.5)} ${u(21.2)} ${v(5)} ${u(21.2)} ${v(8.2)} c ${u(21.2)} ${v(11.3)} ${u(19)} ${v(15.8)} ${u(12)} ${v(20.5)} c h S`);
        break;
      case "Ster":
        cmds.push(`${u(12)} ${v(2)} m ${u(15.1)} ${v(8.6)} l ${u(22)} ${v(9.3)} l ${u(16.8)} ${v(14)} l ${u(18.2)} ${v(21)} l ${u(12)} ${v(17.3)} l ${u(5.8)} ${v(21)} l ${u(7.2)} ${v(14)} l ${u(2)} ${v(9.3)} l ${u(8.9)} ${v(8.6)} l h S`);
        break;
      case "Boek":
        cmds.push(`${u(2)} ${v(6)} m ${u(5.5)} ${v(4)} ${u(9)} ${v(5)} ${u(12)} ${v(7.5)} c ${u(15)} ${v(5)} ${u(18.5)} ${v(4)} ${u(22)} ${v(6)} c ${u(22)} ${v(19)} l ${u(18.5)} ${v(17)} ${u(15)} ${v(18)} ${u(12)} ${v(20.5)} c ${u(9)} ${v(18)} ${u(5.5)} ${v(17)} ${u(2)} ${v(19)} c h S`);
        cmds.push(`${u(12)} ${v(7.5)} m ${u(12)} ${v(20.5)} l S`);
        cmds.push(`${u(5)} ${v(10.5)} m ${u(9)} ${v(11.3)} l ${u(5)} ${v(14)} m ${u(9)} ${v(14.8)} l ${u(19)} ${v(10.5)} m ${u(15)} ${v(11.3)} l ${u(19)} ${v(14)} m ${u(15)} ${v(14.8)} l S`);
        break;
      case "Vliegtuig":
        cmds.push(`${u(12)} ${v(2.5)} m ${u(13.5)} ${v(9)} l ${u(21)} ${v(14)} l ${u(21)} ${v(16)} l ${u(13.5)} ${v(13.5)} l ${u(13.5)} ${v(19)} l ${u(16)} ${v(21)} l ${u(16)} ${v(22)} l ${u(12)} ${v(21)} l ${u(8)} ${v(22)} l ${u(8)} ${v(21)} l ${u(10.5)} ${v(19)} l ${u(10.5)} ${v(13.5)} l ${u(3)} ${v(16)} l ${u(3)} ${v(14)} l ${u(10.5)} ${v(9)} l h S`);
        break;
      case "Boom":
        cmds.push(`${u(12)} ${v(22)} m ${u(12)} ${v(17)} l S`);
        cmds.push(`${u(12)} ${v(3)} m ${u(5)} ${v(12)} l ${u(9)} ${v(12)} l ${u(6)} ${v(17)} l ${u(18)} ${v(17)} l ${u(15)} ${v(12)} l ${u(19)} ${v(12)} l h S`);
        break;
    }
    cmds.push("Q");
  }

  function drawCutLines(cmds) {
    drawLine(cmds, 105, 0, 105, 297, [0.39, 0.45, 0.55], 0.3, true);
    drawLine(cmds, 0, 148.5, 210, 148.5, [0.39, 0.45, 0.55], 0.3, true);
  }

  const MONTHS_NL = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

  function formatCardDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = MONTHS_NL[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function drawFrontCard(cmds, ox, oy, title, dateLabel, gridData, iconNames) {
    const padX = 5;
    const padY = 5;
    const innerW = 105 - padX * 2;
    const x0 = ox + padX;
    const y0 = oy + padY;

    drawText(cmds, "F2", 8.8, x0, y0 + 3.2, title, "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F2", 8.8, x0 + innerW, y0 + 3.2, dateLabel, "right", [0.58, 0.64, 0.72]);
    drawLine(cmds, x0, y0 + 4.8, x0 + innerW, y0 + 4.8, [0.06, 0.09, 0.16], 0.35);

    const tableTop = y0 + 6.3;
    const headerH = 5.6;
    const rowH = 4.02;
    const dayW = 7.2;
    const colW = (innerW - dayW) / iconNames.length;

    drawRect(cmds, x0, tableTop, innerW, headerH, [0.89, 0.91, 0.94], [0.58, 0.64, 0.72], 0.2);
    drawText(cmds, "F2", 6.2, x0 + dayW / 2, tableTop + 3.7, "Dag", "center", [0.06, 0.09, 0.16]);
    for (let c = 0; c < iconNames.length; c++) {
      const cx = x0 + dayW + c * colW;
      drawLine(cmds, cx, tableTop, cx, tableTop + headerH, [0.58, 0.64, 0.72], 0.2);
      drawIcon(cmds, iconNames[c], cx + colW / 2, tableTop + headerH / 2, 3.8);
    }

    for (let r = 0; r < gridData.length; r++) {
      const ry = tableTop + headerH + r * rowH;
      const isEven = r % 2 === 1;
      drawRect(cmds, x0, ry, dayW, rowH, [0.97, 0.98, 0.99], [0.58, 0.64, 0.72], 0.18);
      drawRect(cmds, x0 + dayW, ry, innerW - dayW, rowH, isEven ? [0.95, 0.96, 0.98] : [1, 1, 1], [0.58, 0.64, 0.72], 0.18);

      drawText(cmds, "F2", 6.7, x0 + dayW / 2, ry + 2.9, String(r + 1), "center", [0.12, 0.16, 0.23]);

      for (let c = 0; c < iconNames.length; c++) {
        const cx = x0 + dayW + c * colW;
        if (c > 0) drawLine(cmds, cx, ry, cx, ry + rowH, [0.58, 0.64, 0.72], 0.18);
        drawText(cmds, "F3", 7.1, cx + colW / 2, ry + 2.95, gridData[r][c], "center", [0, 0, 0]);
      }

      if ((r + 1) % 5 === 0 && r < gridData.length - 1) {
        drawLine(cmds, x0, ry + rowH, x0 + innerW, ry + rowH, [0.2, 0.25, 0.33], 0.42);
      }
    }
  }

  function drawBackCard(cmds, ox, oy, title) {
    const padX = 6;
    const padY = 4.0;
    const innerW = 105 - padX * 2;
    const x0 = ox + padX;
    const y0 = oy + padY;

    drawText(cmds, "F2", 8.6, x0, y0 + 2.8, "Hoe controleer je elkaar?", "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F1", 6.2, x0 + innerW, y0 + 2.8, title, "right", [0.28, 0.33, 0.41]);
    drawLine(cmds, x0, y0 + 4.3, x0 + innerW, y0 + 4.3, [0.06, 0.09, 0.16], 0.35);

    const drawStep = (num, yStart, boldPrefix, lineText) => {
      drawRect(cmds, x0, yStart, 3.4, 3.4, [0.06, 0.09, 0.16], null);
      drawText(cmds, "F2", 5.9, x0 + 1.7, yStart + 2.5, String(num), "center", [1, 1, 1]);
      drawText(cmds, "F2", 6.2, x0 + 4.6, yStart + 2.45, boldPrefix, "left", [0.06, 0.09, 0.16]);
      drawText(cmds, "F1", 6.1, x0 + 4.6, yStart + 5.1, lineText, "left", [0.12, 0.16, 0.23]);
    };

    drawStep(1, y0 + 6.2, "Kies een icoon:", "Beller kiest een icoon bovenaan de kaart (bijv. \"De auto\").");
    drawStep(2, y0 + 13.0, "Noem het getal:", "De ander kijkt bij de dag van vandaag en noemt het getal.");
    drawStep(3, y0 + 19.8, "Controleer:", "Klopt het getal? Dan weet je zeker wie je aan de lijn hebt.");

    const exY = y0 + 27.0;
    drawRect(cmds, x0, exY, innerW, 19.5, [0.97, 0.98, 0.99], [0.58, 0.64, 0.72], 0.25);
    drawText(cmds, "F2", 6.2, x0 + 2.2, exY + 3.1, "Voorbeeld: het is vandaag dag 14", "left", [0.06, 0.09, 0.16]);

    const tx = x0 + 2.2;
    const ty = exY + 4.8;
    drawRect(cmds, tx, ty, 12, 5.4, [0.89, 0.91, 0.94], [0.58, 0.64, 0.72], 0.2);
    drawRect(cmds, tx + 12, ty, 14, 5.4, [0.89, 0.91, 0.94], [0.58, 0.64, 0.72], 0.2);
    drawRect(cmds, tx + 26, ty, 14, 5.4, [0.89, 0.91, 0.94], [0.58, 0.64, 0.72], 0.2);
    drawText(cmds, "F2", 6.0, tx + 6, ty + 3.7, "Dag", "center", [0.06, 0.09, 0.16]);
    drawIcon(cmds, "Auto", tx + 19, ty + 2.7, 3.6);
    drawIcon(cmds, "Appel", tx + 33, ty + 2.7, 3.6);

    drawRect(cmds, tx, ty + 5.4, 12, 6.4, [0.98, 0.98, 0.99], [0.58, 0.64, 0.72], 0.2);
    drawRect(cmds, tx + 12, ty + 5.4, 14, 6.4, [0.89, 0.91, 0.94], [0.06, 0.09, 0.16], 0.4);
    drawRect(cmds, tx + 26, ty + 5.4, 14, 6.4, [1, 1, 1], [0.58, 0.64, 0.72], 0.2);
    drawText(cmds, "F2", 6.8, tx + 6, ty + 9.8, "14", "center", [0.06, 0.09, 0.16]);
    drawText(cmds, "F3", 7.6, tx + 19, ty + 10.0, "42", "center", [0.06, 0.09, 0.16]);
    drawText(cmds, "F3", 6.8, tx + 33, ty + 9.8, "87", "center", [0.4, 0.45, 0.55]);

    drawText(cmds, "F2", 6.2, tx + 43, ty + 3.6, "\"Geef me de auto\"", "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F1", 6.2, tx + 43, ty + 8.0, "Antwoord: 42", "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F1", 5.6, tx + 43, ty + 11.8, "Kruispunt dag 14 + Auto", "left", [0.28, 0.33, 0.41]);

    const tip1Y = y0 + 48.2;
    drawRect(cmds, x0, tip1Y, innerW, 9.4, [0.95, 0.96, 0.98], null);
    drawLine(cmds, x0, tip1Y, x0, tip1Y + 9.4, [0.06, 0.09, 0.16], 0.7);
    drawText(cmds, "F2", 6.1, x0 + 2.0, tip1Y + 2.8, "Andere datum of brief:", "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F1", 5.9, x0 + 2.0, tip1Y + 5.6, "Spreek een andere dag af (\"Appel van dag 3\") of gebruik", "left", [0.12, 0.16, 0.23]);
    drawText(cmds, "F1", 5.9, x0 + 2.0, tip1Y + 8.2, "de datum die op een brief of bericht staat.", "left", [0.12, 0.16, 0.23]);

    const tip2Y = y0 + 59.0;
    drawRect(cmds, x0, tip2Y, innerW, 11.8, [0.95, 0.96, 0.98], null);
    drawLine(cmds, x0, tip2Y, x0, tip2Y + 11.8, [0.06, 0.09, 0.16], 0.7);
    drawText(cmds, "F2", 6.1, x0 + 2.0, tip2Y + 2.8, "Extra veilig (eenmalig gebruik):", "left", [0.06, 0.09, 0.16]);
    drawText(cmds, "F1", 5.9, x0 + 2.0, tip2Y + 5.6, "Streep een getal door nadat je het gebruikt hebt, zodat", "left", [0.12, 0.16, 0.23]);
    drawText(cmds, "F1", 5.9, x0 + 2.0, tip2Y + 8.2, "niemand hetzelfde antwoord ooit een tweede keer kan", "left", [0.12, 0.16, 0.23]);
    drawText(cmds, "F1", 5.9, x0 + 2.0, tip2Y + 10.8, "gebruiken.", "left", [0.12, 0.16, 0.23]);

    // Notities-vak met 8 schrijflijnen (7mm tussenruimte)
    const notesY = y0 + 73.2;
    drawText(cmds, "F2", 6.2, x0, notesY, "Notities", "left", [0.2, 0.25, 0.33]);
    for (let i = 1; i <= 8; i++) {
      const ly = notesY + i * 7.0;
      drawLine(cmds, x0, ly, x0 + innerW, ly, [0.62, 0.68, 0.76], 0.2);
    }

    const footY = y0 + 131.5;
    drawText(cmds, "F1", 5.8, x0, footY + 2.7, "Bewaar dit kaartje veilig en maak er geen foto's van.", "left", [0.28, 0.33, 0.41]);
    drawText(cmds, "F1", 5.8, x0, footY + 5.4, "Bij verlies: print een nieuwe set voor de hele familie.", "left", [0.28, 0.33, 0.41]);
    drawText(cmds, "F1", 5.6, x0, footY + 8.3, "Maak je eigen kaartje op zekerwie.nl · MIT-licentie", "left", [0.42, 0.47, 0.55]);
  }

  function buildPdfBlob(title, gridData, iconNames, format = "a4") {
    const cleanTitle = (title || "ZekerWie.nl").trim() || "ZekerWie.nl";
    const dateLabel = formatCardDate();
    const isA6 = format === "a6";
    const isA4Large = format === "a4-large";
    const pageW_Mm = isA6 ? A6_W_MM : A4_W_MM;
    const pageH_Mm = isA6 ? A6_H_MM : A4_H_MM;
    const pageW_Pt = pageW_Mm * MM_TO_PT;
    const pageH_Pt = pageH_Mm * MM_TO_PT;

    // Voor a4-large tekenen we op A6-schaal en schalen het hele vel 2x naar A4
    currentPageH_Pt = (isA6 || isA4Large ? A6_H_MM : A4_H_MM) * MM_TO_PT;

    const quadrants =
      isA6 || isA4Large
        ? [[0, 0]]
        : [
            [0, 0],
            [105, 0],
            [0, 148.5],
            [105, 148.5]
          ];

    const page1Cmds = [];
    if (isA4Large) page1Cmds.push("q 2 0 0 2 0 0 cm");
    for (const [ox, oy] of quadrants) {
      drawFrontCard(page1Cmds, ox, oy, cleanTitle, dateLabel, gridData, iconNames);
    }
    if (!isA6 && !isA4Large) drawCutLines(page1Cmds);
    if (isA4Large) page1Cmds.push("Q");

    const page2Cmds = [];
    if (isA4Large) page2Cmds.push("q 2 0 0 2 0 0 cm");
    for (const [ox, oy] of quadrants) {
      drawBackCard(page2Cmds, ox, oy, cleanTitle);
    }
    if (!isA6 && !isA4Large) drawCutLines(page2Cmds);
    if (isA4Large) page2Cmds.push("Q");

    const stream1 = page1Cmds.join("\n");
    const stream2 = page2Cmds.join("\n");

    const objects = [
      "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>\nendobj\n",
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW_Pt.toFixed(2)} ${pageH_Pt.toFixed(2)}] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 8 0 R >>\nendobj\n`,
      `4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW_Pt.toFixed(2)} ${pageH_Pt.toFixed(2)}] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 9 0 R >>\nendobj\n`,
      "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n",
      "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n",
      "7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>\nendobj\n",
      `8 0 obj\n<< /Length ${stream1.length} >>\nstream\n${stream1}\nendstream\nendobj\n`,
      `9 0 obj\n<< /Length ${stream2.length} >>\nstream\n${stream2}\nendstream\nendobj\n`
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    for (const obj of objects) {
      offsets.push(pdf.length);
      pdf += obj;
    }

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let i = 1; i < offsets.length; i++) {
      pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) {
      bytes[i] = pdf.charCodeAt(i) & 0xff;
    }
    return new Blob([bytes], { type: "application/pdf" });
  }

  window.downloadAuthCardsPdf = function (title, gridData, iconNames, format = "a4") {
    const blob = buildPdfBlob(title, gridData, iconNames, format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (title || "zekerwie")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "zekerwie";
    a.href = url;
    a.download = `${slug}-${format}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
})();
