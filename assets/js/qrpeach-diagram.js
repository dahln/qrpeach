(function (global) {
  'use strict';

  // Diagram renderer for encoder overlays and final QR visualization.
  // This module builds SVG markup from the generator model and keeps helpers
  // split into focused functions so each transform step is easy to audit.

  const PATH_COLORS = {
    data: { stroke: '#3b82f6', fill: 'transparent' },
    ecc: { stroke: '#ef4444', fill: 'transparent' },
    remainder: { stroke: '#a855f7', fill: 'transparent' }
  };

  const PAYLOAD_SPAN_COLORS = ['#0f766e', '#c2410c', '#7c3aed', '#be123c', '#1d4ed8', '#a16207', '#047857', '#0f172a', '#9333ea', '#0369a1'];
  const FIELD_SPAN_COLORS = {
    mode: '#15803d',
    count: '#d97706',
    payload: '#0f766e',
    terminator: '#475569',
    padbits: '#64748b',
    padcw: '#0f172a',
    ecc: '#dc2626',
    remainder: '#7c3aed'
  };
  const REGION_COLORS = ['#dbeafe', '#1e293b', '#ffffff', '#e2e8f0', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  const payloadSpanColorCache = [];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeTooltipAttr(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;');
  }

  function formatHexByte(value) {
    return value.toString(16).toUpperCase().padStart(2, '0');
  }

  function formatSpanBadge(charLabel) {
    if (charLabel === 'SPACE') return 'SP';
    return charLabel.length > 2 ? charLabel.slice(0, 2) : charLabel;
  }

  function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const fullHex = normalized.length === 3
      ? normalized.split('').map(function (char) { return char + char; }).join('')
      : normalized;
    const value = parseInt(fullHex, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function rgbToHsl(color) {
    const red = color.r / 255;
    const green = color.g / 255;
    const blue = color.b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    const delta = max - min;

    if (delta === 0) return { h: 0, s: 0, l: lightness };

    const saturation = lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);
    let hue;

    switch (max) {
      case red:
        hue = ((green - blue) / delta) + (green < blue ? 6 : 0);
        break;
      case green:
        hue = ((blue - red) / delta) + 2;
        break;
      default:
        hue = ((red - green) / delta) + 4;
        break;
    }

    return { h: hue * 60, s: saturation, l: lightness };
  }

  function getHueDelta(a, b) {
    const diff = Math.abs(a - b);
    return Math.min(diff, 360 - diff);
  }

  function arePayloadSpanColorsSimilar(firstColor, secondColor) {
    if (firstColor === secondColor) return true;
    const firstRgb = hexToRgb(firstColor);
    const secondRgb = hexToRgb(secondColor);
    const redDiff = firstRgb.r - secondRgb.r;
    const greenDiff = firstRgb.g - secondRgb.g;
    const blueDiff = firstRgb.b - secondRgb.b;
    const rgbDistance = Math.sqrt(redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff);
    if (rgbDistance < 110) return true;

    const firstHsl = rgbToHsl(firstRgb);
    const secondHsl = rgbToHsl(secondRgb);
    return getHueDelta(firstHsl.h, secondHsl.h) < 32 && Math.abs(firstHsl.l - secondHsl.l) < 0.18;
  }

  function pickPayloadSpanColor(previousColor, startIndex) {
    for (let offset = 0; offset < PAYLOAD_SPAN_COLORS.length; offset++) {
      const candidate = PAYLOAD_SPAN_COLORS[(startIndex + offset) % PAYLOAD_SPAN_COLORS.length];
      if (!previousColor || !arePayloadSpanColorsSimilar(candidate, previousColor)) {
        return candidate;
      }
    }
    return PAYLOAD_SPAN_COLORS[startIndex % PAYLOAD_SPAN_COLORS.length];
  }

  function getPayloadSpanColor(index) {
    while (payloadSpanColorCache.length <= index) {
      const previousColor = payloadSpanColorCache[payloadSpanColorCache.length - 1] || null;
      payloadSpanColorCache.push(pickPayloadSpanColor(previousColor, payloadSpanColorCache.length));
    }
    return payloadSpanColorCache[index];
  }

  function getFieldSpanColor(kind, index) {
    if (kind === 'payload') return getPayloadSpanColor(index || 0);
    return FIELD_SPAN_COLORS[kind] || '#334155';
  }

  function formatValueSpanDetail(span) {
    if (span.kind === 'payload' && span.byteValues && span.byteValues.length) {
      return span.charLabel + ' = ' + span.byteValues.map(function (value) {
        return '0x' + formatHexByte(value);
      }).join(' ');
    }
    if (span.kind === 'padcw' && span.byteValues && span.byteValues.length) {
      return 'Pad byte ' + span.byteValues.map(function (value) {
        return '0x' + formatHexByte(value);
      }).join(' ');
    }
    return span.summary || span.detail || span.label;
  }

  function formatDisplayCharLabel(charLabel) {
    if (!charLabel) return '';
    if (charLabel === 'SPACE') return 'space';
    return charLabel;
  }

  function formatBinaryBytes(byteValues) {
    return byteValues.map(function (value) {
      return value.toString(2).padStart(8, '0');
    }).join(' ');
  }

  function formatByteValueDetails(byteValues) {
    return byteValues.map(function (value) {
      return value + ' (0x' + formatHexByte(value) + ')';
    }).join(' ');
  }

  function formatBinaryValueDetails(bits) {
    if (!bits) return '';
    const value = parseInt(bits, 2);
    if (!Number.isFinite(value)) return '';
    return value + ' (0x' + value.toString(16).toUpperCase() + ')';
  }

  function getSegmentType(moduleIndex, dataModules, eccModules) {
    if (moduleIndex < dataModules) return 'data';
    if (moduleIndex < dataModules + eccModules) return 'ecc';
    return 'remainder';
  }

  function buildOverlayValueSpans(model) {
    const spans = [];
    if (!model) return spans;

    if (Array.isArray(model.values)) {
      for (const value of model.values) {
        spans.push({
          key: value.key || (value.kind + ':' + value.index),
          kind: value.kind,
          bitStart: value.bitStart,
          bitEnd: value.bitEnd,
          bits: value.bits,
          label: value.kind === 'payload'
            ? '#' + value.charIndex + ' ' + formatSpanBadge(value.charLabel)
            : value.kind === 'terminator'
              ? 'TERM'
              : value.kind === 'padbits'
                ? 'ALIGN'
                : value.kind === 'padcw'
                  ? 'PAD ' + (value.byteValues && value.byteValues.length ? formatHexByte(value.byteValues[0]) : '')
                  : value.label.toUpperCase(),
          summary: value.summary,
          detail: formatValueSpanDetail(value),
          color: getFieldSpanColor(value.kind, value.kind === 'payload' ? value.charIndex : 0),
          group: 'data',
          charLabel: value.charLabel || '',
          byteValues: value.byteValues || []
        });
      }
    }

    const eccCodewords = model.finalQr && Array.isArray(model.finalQr.interleavedCodewords)
      ? model.finalQr.interleavedCodewords.filter(function (entry) { return entry.kind === 'ecc'; })
      : [];

    if (eccCodewords.length > 0) {
      eccCodewords.forEach(function (entry, index) {
        spans.push({
          key: 'ecc:' + index,
          kind: 'ecc',
          bitStart: index * 8,
          bitEnd: index * 8 + 7,
          bits: entry.value.toString(2).padStart(8, '0'),
          label: 'ECC #' + index,
          summary: 'Error correction byte ' + index,
          detail: 'Error correction byte ' + index + ' = 0x' + formatHexByte(entry.value),
          color: getFieldSpanColor('ecc', 0),
          group: 'ecc',
          byteValues: [entry.value]
        });
      });
    } else if (model.eccBytes > 0) {
      spans.push({
        key: 'ecc',
        kind: 'ecc',
        bitStart: 0,
        bitEnd: model.eccBytes * 8 - 1,
        bits: '',
        label: 'ECC',
        summary: 'Error correction bytes',
        detail: 'Error correction bytes (' + model.eccBytes + ')',
        color: getFieldSpanColor('ecc', 0),
        group: 'ecc',
        byteValues: []
      });
    }

    if (model.remainder > 0) {
      spans.push({
        key: 'remainder',
        kind: 'remainder',
        bitStart: 0,
        bitEnd: model.remainder - 1,
        bits: '0'.repeat(model.remainder),
        label: 'REM',
        summary: 'Remainder bits',
        detail: 'Remainder bits (' + model.remainder + ')',
        color: getFieldSpanColor('remainder', 0),
        group: 'remainder',
        byteValues: []
      });
    }

    return spans;
  }

  function findValueSpanForGroupIndex(spans, group, index) {
    for (const span of spans) {
      if (span.group === group && index >= span.bitStart && index <= span.bitEnd) {
        return span;
      }
    }
    return null;
  }

  function getOverlayBitNumber(spans, group, index) {
    const span = findValueSpanForGroupIndex(spans, group, index);
    if (!span) return index % 8;
    return span.bitEnd - index;
  }

  function getSpanModulesForGroup(span, groups) {
    const modules = groups[span.group] || [];
    return modules.slice(span.bitStart, span.bitEnd + 1);
  }

  function getDisplayedPlacedBitValue(placedBits, index, mode) {
    const placedBit = placedBits[index];
    if (!placedBit) return null;
    return mode === 'masked' ? placedBit.maskedValue : placedBit.value;
  }

  function getFormatInfoModules(finalQr, size) {
    if (!finalQr || !finalQr.formatInfo || !finalQr.formatInfo.bits) return [];

    const bits = finalQr.formatInfo.bits;
    const modules = [];

    function push(row, col, runtimeBit, copy) {
      const value = bits.charAt(runtimeBit);
      const kind = runtimeBit <= 1 ? 'ecc' : runtimeBit <= 4 ? 'mask' : 'bch';
      modules.push({ row: row, col: col, runtimeBit: runtimeBit, copy: copy, kind: kind, value: value, label: value });
    }

    for (let i = 0; i <= 5; i++) push(8, i, i, 1);
    push(8, 7, 6, 1);
    push(8, 8, 7, 1);
    push(7, 8, 8, 1);
    for (let i = 9; i < 15; i++) push(14 - i, 8, i, 1);

    for (let i = 0; i < 8; i++) {
      const row = size - 1 - i;
      if (row !== size - 8) push(row, 8, i, 2);
    }
    for (let i = 8; i < 15; i++) push(8, size - 15 + i, i, 2);

    modules.push({ row: size - 8, col: 8, runtimeBit: null, copy: 0, kind: 'dark', value: '1', label: 'D' });
    return modules;
  }

  function formatFunctionModuleTooltip(entry) {
    if (entry.kind === 'dark') {
      return 'Dark module | fixed black module | Row ' + entry.row + ', Col ' + entry.col;
    }
    const part = entry.kind === 'ecc' ? 'ECC level bits' : entry.kind === 'mask' ? 'Mask pattern bits' : 'BCH protection bits';
    return 'Format bit ' + entry.runtimeBit + ' = ' + entry.value + ' | copy ' + entry.copy + ' | ' + part + ' | Row ' + entry.row + ', Col ' + entry.col;
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function measureSvgLabel(lines, fontSize, paddingX, paddingY) {
    const lineHeight = fontSize + 2;
    const maxLen = Math.max.apply(null, [1].concat(lines.map(function (line) { return line.length; })));
    return {
      fontSize: fontSize,
      lineHeight: lineHeight,
      paddingX: paddingX,
      paddingY: paddingY,
      width: maxLen * fontSize * 0.56 + paddingX * 2,
      height: lines.length * lineHeight + paddingY * 2 - 2
    };
  }

  function getValueBadgeAnchor(spanModules, modSize) {
    const half = modSize / 2;
    const anchorModule = spanModules[spanModules.length - 1];
    if (!anchorModule) return { x: half, y: half };
    return {
      x: anchorModule.c * modSize + half,
      y: anchorModule.r * modSize + half
    };
  }

  function buildSvgValueBadge(x, y, label, highlightModules, options) {
    const badgeMetrics = measureSvgLabel([label], options.fontSize, 3, 2);
    const margin = 4;
    const clampedX = clampNumber(x, badgeMetrics.width / 2 + margin, options.svgWidth - badgeMetrics.width / 2 - margin);
    const clampedY = clampNumber(y, badgeMetrics.height / 2 + margin, options.svgHeight - badgeMetrics.height / 2 - margin);
    const boxX = clampedX - badgeMetrics.width / 2;
    const boxY = clampedY - badgeMetrics.height / 2;
    const highlightRects = highlightModules.map(function (module) {
      return '<rect x="' + (module.c * options.modSize) + '" y="' + (module.r * options.modSize) + '" width="' + options.modSize + '" height="' + options.modSize + '" fill="' + options.highlightFill + '" stroke="' + options.stroke + '" stroke-width="1.1"/>';
    }).join('');
    const hitRects = highlightModules.map(function (module) {
      return '<rect x="' + (module.c * options.modSize) + '" y="' + (module.r * options.modSize) + '" width="' + options.modSize + '" height="' + options.modSize + '" fill="transparent" class="tip-rect cw-hit" data-tip="' + escapeTooltipAttr(options.tipText) + '"/>';
    }).join('');
    return '\n      <g class="value-badge" data-anchor-x="' + clampedX + '" data-anchor-y="' + clampedY + '">\n        <g class="value-highlight">' + highlightRects + '</g>\n        <g class="value-hitboxes">' + hitRects + '</g>\n        <rect x="' + boxX + '" y="' + boxY + '" width="' + badgeMetrics.width + '" height="' + badgeMetrics.height + '" rx="3" ry="3" fill="rgba(255,255,255,0.88)" stroke="' + options.stroke + '" stroke-width="0.95" style="pointer-events:none"/>\n        <text x="' + clampedX + '" y="' + clampedY + '" font-family="\'JetBrains Mono\',monospace" font-size="' + badgeMetrics.fontSize + '" fill="#0f172a" text-anchor="middle" dominant-baseline="middle" font-weight="bold" style="pointer-events:none;paint-order:stroke;stroke:#ffffffcc;stroke-width:' + Math.max(0.35, badgeMetrics.fontSize * 0.08) + 'px;">' + escapeHtml(label) + '</text>\n      </g>\n    ';
  }

  function buildSvgValueHover(highlightModules, options) {
    const highlightRects = highlightModules.map(function (module) {
      return '<rect x="' + (module.c * options.modSize) + '" y="' + (module.r * options.modSize) + '" width="' + options.modSize + '" height="' + options.modSize + '" fill="' + options.highlightFill + '" stroke="' + options.stroke + '" stroke-width="1.1"/>';
    }).join('');
    const hitRects = highlightModules.map(function (module) {
      return '<rect x="' + (module.c * options.modSize) + '" y="' + (module.r * options.modSize) + '" width="' + options.modSize + '" height="' + options.modSize + '" fill="transparent" class="tip-rect cw-hit" data-tip="' + escapeTooltipAttr(options.tipText) + '"/>';
    }).join('');
    return '<g class="value-badge"><g class="value-highlight">' + highlightRects + '</g><g class="value-hitboxes">' + hitRects + '</g></g>';
  }

  function buildFlowArrowSvg(fromModule, toModule, color, modSize) {
    const x1 = fromModule.c * modSize + modSize / 2;
    const y1 = fromModule.r * modSize + modSize / 2;
    const x2 = toModule.c * modSize + modSize / 2;
    const y2 = toModule.r * modSize + modSize / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 0.01) return '';

    const ux = dx / distance;
    const uy = dy / distance;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const arrowLength = Math.max(1.45, modSize * 0.155);
    const arrowHalfHeight = Math.max(0.54, modSize * 0.058);
    const spacing = Math.max(modSize * 0.24, arrowLength * 1.12);
    const edgeInset = Math.min(distance / 2, Math.max(modSize * 0.08, arrowLength * 0.72));
    const usableDistance = Math.max(0, distance - edgeInset * 2);
    const arrowCount = Math.max(1, Math.floor(usableDistance / spacing) + 1);
    const startOffset = usableDistance <= 0 ? distance / 2 : edgeInset + (usableDistance - (arrowCount - 1) * spacing) / 2;

    let svg = '';
    for (let index = 0; index < arrowCount; index++) {
      const offset = usableDistance <= 0 ? distance / 2 : startOffset + index * spacing;
      const cx = x1 + ux * offset;
      const cy = y1 + uy * offset;
      svg += '<path d="M0,0 L' + (-arrowLength) + ',' + (-arrowHalfHeight) + ' L' + (-arrowLength * 0.62) + ',0 L' + (-arrowLength) + ',' + arrowHalfHeight + ' Z" fill="' + color + '" opacity="0.9" transform="translate(' + cx + ' ' + cy + ') rotate(' + angle + ')"/>';
    }
    return svg;
  }

  function formatValueTooltip(span) {
    const lines = [span.label];
    if (span.kind === 'payload' && span.byteValues && span.byteValues.length) {
      lines.push('Character: ' + formatDisplayCharLabel(span.charLabel));
      if (span.byteValues.length === 1 && span.byteValues[0] <= 0x7F) {
        lines.push('ASCII: ' + span.byteValues[0] + ' (0x' + formatHexByte(span.byteValues[0]) + ')');
      } else {
        lines.push('UTF-8: ' + formatByteValueDetails(span.byteValues));
      }
      lines.push('Binary: ' + formatBinaryBytes(span.byteValues));
    } else if (span.byteValues && span.byteValues.length) {
      lines.push('Byte Value: ' + formatByteValueDetails(span.byteValues));
      lines.push('Binary: ' + formatBinaryBytes(span.byteValues));
    } else if (span.bits) {
      lines.push('Value: ' + formatBinaryValueDetails(span.bits));
      lines.push('Binary: ' + span.bits);
    }
    if (span.detail) lines.push(span.detail);
    if (span.kind === 'ecc') lines.push('Type: Error correction bytes');
    if (span.kind === 'remainder') lines.push('Type: Remainder bits');
    return lines.join('\n');
  }

  function buildOverlaySvg(model, containerWidth, opts) {
    const options = opts || {};
    const grid = model.moduleGrid.grid;
    const size = model.moduleGrid.size;
    const aligns = model.moduleGrid.aligns;
    const modSize = Math.max(2, Math.floor(containerWidth / size));
    const svgSize = modSize * size;
    const showData = options.showData;
    const showEcc = options.showEcc;
    const showRemainder = options.showRemainder;
    const showLabels = options.showLabels;
    const showCWLabels = options.showCWLabels;
    const showValueSpans = options.showValueSpans;
    const showCombinedLabels = options.showCombinedLabels;
    const showValueBits = options.showValueBits;
    const valueBitMode = options.valueBitMode === 'masked' ? 'masked' : 'unmasked';
    const encoderOverlay = options.encoderOverlay || null;
    const formatInfoModules = encoderOverlay && encoderOverlay.finalQr
      ? getFormatInfoModules(encoderOverlay.finalQr, size)
      : [];

    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const type = grid[r][c];
        let color = REGION_COLORS[type];
        if (type === 4) {
          color = r === 6 ? (c % 2 === 0 ? '#f59e0b' : '#fef3c7') : (r % 2 === 0 ? '#f59e0b' : '#fef3c7');
        }
        if (type === 1) color = '#1e293b';
        if (type === 2) color = '#ffffff';
        if (type === 5) {
          let isAlignCenter = false;
          let isAlignRing = false;
          for (const align of aligns) {
            const ar = align[0];
            const ac = align[1];
            if (r === ar && c === ac) {
              isAlignCenter = true;
              break;
            }
            if (Math.abs(r - ar) <= 1 && Math.abs(c - ac) <= 1 && !(r === ar && c === ac)) {
              isAlignRing = true;
              break;
            }
          }
          if (isAlignCenter) color = '#065f46';
          else if (isAlignRing) color = '#d1fae5';
          else color = '#10b981';
        }
        rects += '<rect x="' + (c * modSize) + '" y="' + (r * modSize) + '" width="' + modSize + '" height="' + modSize + '" fill="' + color + '"/>';
      }
    }

    let pathSvg = '';
    let floatingLabelSvg = '';
    let tooltipRects = '';
    let functionBitSvg = '';

    if (showCombinedLabels && formatInfoModules.length > 0 && modSize >= 10) {
      const functionFontSize = Math.max(modSize * 0.34, 5.5);
      const functionStroke = Math.max(0.35, functionFontSize * 0.12);
      functionBitSvg += '<g font-family="\'JetBrains Mono\',monospace" font-size="' + functionFontSize + '" text-anchor="middle" dominant-baseline="central" style="paint-order:stroke;stroke:#ffffffcc;stroke-width:' + functionStroke + 'px;">';
      for (const entry of formatInfoModules) {
        const centerX = entry.col * modSize + (modSize / 2);
        const centerY = entry.row * modSize + (modSize / 2);
        const fill = entry.kind === 'ecc' ? '#991b1b' : entry.kind === 'mask' ? '#c2410c' : entry.kind === 'dark' ? '#111827' : '#4338ca';
        functionBitSvg += '<text x="' + centerX + '" y="' + centerY + '" fill="' + fill + '" font-weight="bold">' + escapeHtml(entry.label) + '</text>';
        tooltipRects += '<rect x="' + (entry.col * modSize) + '" y="' + (entry.row * modSize) + '" width="' + modSize + '" height="' + modSize + '" fill="transparent" class="tip-rect" data-tip="' + escapeTooltipAttr(formatFunctionModuleTooltip(entry)) + '"/>';
      }
      functionBitSvg += '</g>';
    }

    if (showData || showEcc || showRemainder) {
      const pts = model.zigzagPath.map(function (entry) { return [entry.r, entry.c]; });
      const dataModules = model.dataBytes * 8;
      const eccModules = model.eccBytes * 8;
      const half = modSize / 2;
      const valueSpans = buildOverlayValueSpans(encoderOverlay);
      const placedBits = encoderOverlay && encoderOverlay.finalQr && Array.isArray(encoderOverlay.finalQr.placedBits)
        ? encoderOverlay.finalQr.placedBits
        : [];
      const canShowLabels = showLabels && modSize >= 8;
      const canShowValueSpans = showValueSpans && encoderOverlay && valueSpans.length > 0 && modSize >= 5;
      const canShowCombinedLabels = showCombinedLabels && encoderOverlay && modSize >= 10;
      const canShowValueBits = showValueBits && placedBits.length > 0 && modSize >= 7;

      const groups = { data: [], ecc: [], remainder: [] };
      for (let i = 0; i < pts.length; i++) {
        const segType = getSegmentType(i, dataModules, eccModules);
        groups[segType].push({ idx: i, r: pts[i][0], c: pts[i][1] });
      }

      const typeKeys = ['data', 'ecc', 'remainder'];
      const typeShow = { data: showData, ecc: showEcc, remainder: showRemainder };

      if (canShowValueSpans) {
        pathSvg += '<g>';
        for (const span of valueSpans) {
          if (!typeShow[span.group]) continue;
          const spanModules = getSpanModulesForGroup(span, groups);
          if (!spanModules.length) continue;
          if (spanModules.length === 1) {
            pathSvg += '<circle cx="' + (spanModules[0].c * modSize + half) + '" cy="' + (spanModules[0].r * modSize + half) + '" r="' + Math.max(1.5, modSize * 0.18) + '" fill="' + span.color + '" opacity="0.95"/>';
            continue;
          }
          for (let i = 1; i < spanModules.length; i++) {
            pathSvg += buildFlowArrowSvg(spanModules[i - 1], spanModules[i], span.color, modSize);
          }
        }
        pathSvg += '</g>';
      }

      if (canShowLabels) {
        const fontSize = Math.max(modSize * 0.26, 3.6);
        const xInset = Math.max(1.4, modSize * 0.14);
        const yInset = Math.max(1, modSize * 0.12);
        for (const tk of typeKeys) {
          if (!typeShow[tk] || groups[tk].length === 0) continue;
          pathSvg += '<g font-family="\'JetBrains Mono\',monospace" font-size="' + fontSize + '" fill="#0f172a" opacity="0.66" text-anchor="end" dominant-baseline="alphabetic" style="paint-order:stroke;stroke:#ffffffa6;stroke-width:' + Math.max(0.25, fontSize * 0.1) + 'px;">';
          for (const module of groups[tk]) {
            const groupIndex = tk === 'data'
              ? module.idx
              : tk === 'ecc'
                ? module.idx - dataModules
                : module.idx - dataModules - eccModules;
            const label = getOverlayBitNumber(valueSpans, tk, groupIndex);
            pathSvg += '<text x="' + ((module.c + 1) * modSize - xInset) + '" y="' + ((module.r + 1) * modSize - yInset) + '">' + label + '</text>';
          }
          pathSvg += '</g>';
        }
      }

      if (canShowValueBits) {
        const fontSize = Math.max(modSize * 0.28, 4);
        const xInset = Math.max(1.2, modSize * 0.12);
        const yInset = Math.max(1, modSize * 0.08);
        pathSvg += '<g font-family="\'JetBrains Mono\',monospace" font-size="' + fontSize + '" font-weight="700" fill="#0f172a" opacity="0.86" text-anchor="end" dominant-baseline="hanging" style="paint-order:stroke;stroke:#ffffffcc;stroke-width:' + Math.max(0.25, fontSize * 0.11) + 'px;">';
        for (const tk of typeKeys) {
          if (!typeShow[tk] || groups[tk].length === 0) continue;
          for (const module of groups[tk]) {
            const label = getDisplayedPlacedBitValue(placedBits, module.idx, valueBitMode);
            if (label == null) continue;
            pathSvg += '<text x="' + ((module.c + 1) * modSize - xInset) + '" y="' + (module.r * modSize + yInset) + '">' + label + '</text>';
          }
        }
        pathSvg += '</g>';
      }

      if (canShowCombinedLabels) {
        const compactFont = Math.max(modSize * 0.24, 5.6);
        floatingLabelSvg += '<g>';
        for (const span of valueSpans) {
          if (!typeShow[span.group]) continue;
          if (span.showBadge === false) continue;
          const spanModules = getSpanModulesForGroup(span, groups);
          if (!spanModules.length) continue;
          const anchor = getValueBadgeAnchor(spanModules, modSize);
          floatingLabelSvg += buildSvgValueBadge(anchor.x, anchor.y, span.label, spanModules, {
            fontSize: compactFont,
            stroke: span.color,
            highlightFill: 'rgba(255,255,255,0.0)',
            tipText: formatValueTooltip(span),
            modSize: modSize,
            svgWidth: svgSize,
            svgHeight: svgSize
          });
        }
        floatingLabelSvg += '</g>';
      }

      if (encoderOverlay && valueSpans.length > 0 && modSize >= 5) {
        floatingLabelSvg += '<g>';
        for (const span of valueSpans) {
          if (!typeShow[span.group]) continue;
          if (span.showBadge !== false) continue;
          const spanModules = getSpanModulesForGroup(span, groups);
          if (!spanModules.length) continue;
          floatingLabelSvg += buildSvgValueHover(spanModules, {
            stroke: span.color,
            highlightFill: 'rgba(255,255,255,0.0)',
            tipText: formatValueTooltip(span),
            modSize: modSize
          });
        }
        floatingLabelSvg += '</g>';
      }

      for (const tk of typeKeys) {
        if (!typeShow[tk] || groups[tk].length === 0) continue;
        for (const module of groups[tk]) {
          const localIndex = tk === 'data'
            ? module.idx
            : tk === 'ecc'
              ? module.idx - dataModules
              : module.idx - dataModules - eccModules;
          const span = findValueSpanForGroupIndex(valueSpans, tk, localIndex);
          const placedBit = placedBits[module.idx] || null;
          const rawValue = placedBit ? placedBit.value : null;
          const maskedValue = placedBit ? placedBit.maskedValue : null;
          const spanTooltip = span ? formatValueTooltip(span) + '\n' : '';
          let tipText;
          if (tk === 'data' && encoderOverlay && encoderOverlay.bits[module.idx]) {
            const bitInfo = encoderOverlay.bits[module.idx];
            tipText = spanTooltip + 'Placed bit ' + module.idx + ' = ' + bitInfo.bit + (rawValue === null ? '' : ' | raw ' + rawValue) + (maskedValue === null ? '' : ' | masked ' + maskedValue) + ' | ' + bitInfo.detail + ' | Row ' + module.r + ', Col ' + module.c;
          } else if (tk === 'ecc') {
            tipText = spanTooltip + 'ECC bit ' + localIndex + (rawValue === null ? '' : ' | raw ' + rawValue) + (maskedValue === null ? '' : ' | masked ' + maskedValue) + ' | Row ' + module.r + ', Col ' + module.c;
          } else {
            tipText = spanTooltip + 'Remainder bit ' + localIndex + (rawValue === null ? '' : ' | raw ' + rawValue) + (maskedValue === null ? '' : ' | masked ' + maskedValue) + ' | Row ' + module.r + ', Col ' + module.c;
          }
          tooltipRects += '<rect x="' + (module.c * modSize) + '" y="' + (module.r * modSize) + '" width="' + modSize + '" height="' + modSize + '" fill="transparent" class="tip-rect" data-tip="' + escapeTooltipAttr(tipText) + '"/>';
        }
      }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + svgSize + '" height="' + svgSize + '" viewBox="0 0 ' + svgSize + ' ' + svgSize + '" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #e2e8f0;overflow:visible;" data-version="' + model.version + '"><style>.value-badge{cursor:default}.value-badge .value-highlight{opacity:0;pointer-events:none}.value-badge:hover .value-highlight{opacity:1}.value-badge .cw-hit{cursor:pointer}</style>' + rects + pathSvg + functionBitSvg + tooltipRects + floatingLabelSvg + '</svg>';
  }

  function buildFinalQrSvg(finalQr, maxWidth) {
    const matrix = finalQr.matrix;
    const count = matrix.length;
    const cellSize = finalQr.cellSize;
    const margin = cellSize * 4;
    const sizePx = count * cellSize + margin * 2;
    let modules = '<rect width="' + sizePx + '" height="' + sizePx + '" fill="#ffffff"/>';
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!matrix[row][col]) continue;
        modules += '<rect x="' + (margin + col * cellSize) + '" y="' + (margin + row * cellSize) + '" width="' + cellSize + '" height="' + cellSize + '" fill="#000000"/>';
      }
    }
    const width = maxWidth || 320;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + sizePx + '" height="' + sizePx + '" viewBox="0 0 ' + sizePx + ' ' + sizePx + '" style="width:100%;height:auto;display:block;max-width:' + width + 'px;margin:0 auto;">' + modules + '</svg>';
  }

  global.QRPeachDiagram = {
    buildOverlaySvg: buildOverlaySvg,
    buildFinalQrSvg: buildFinalQrSvg
  };
})(typeof window !== 'undefined' ? window : this);
