(function (global) {
  'use strict';

  // This page controller wires up encoder form inputs to QRPeach's runtime API,
  // then renders human-readable summaries, diagrams, and final-symbol metadata.
  // The implementation intentionally favors explicit control flow and plain
  // JavaScript syntax so the generated distribution remains easy to review.

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const DEFAULT_INPUTS = {
    text: { value: 'HELLO WORLD' },
    uri: { value: 'sip:ada@example.com' },
    url: { value: 'https://example.com' },
    email: { address: 'ada@example.com', subject: 'Hello', body: 'Thanks for scanning this QR.' },
    phone: { number: '+15551234567' },
    sms: { number: '+15551234567', message: 'Hello from QR Peach' },
    contact: {
      name: 'Ada Lovelace',
      org: 'Analytical Engines',
      phone: '+15551234567',
      email: 'ada@example.com',
      url: 'https://example.com',
      note: 'First programmer'
    },
    vcard: {
      name: 'Ada Lovelace',
      org: 'Analytical Engines',
      phone: '+15551234567',
      email: 'ada@example.com',
      url: 'https://example.com',
      note: 'First programmer'
    },
    event: {
      title: 'QR Peach Demo',
      start: '2026-06-01T09:00',
      end: '2026-06-01T10:00',
      location: 'Main Studio',
      description: 'Walk through the QR payload and symbol structure.',
      allDay: false
    },
    wifi: { ssid: 'Cafe WiFi', encryption: 'WPA', password: 'secret123', hidden: false },
    geo: { lat: '37.7749', lng: '-122.4194', query: 'Coffee shop' }
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function formatHexByte(value) {
    return value.toString(16).toUpperCase().padStart(2, '0');
  }

  function formatBitRange(startBit, endBit) {
    if (typeof startBit !== 'number' || typeof endBit !== 'number') return '';
    return startBit === endBit ? '[' + startBit + ']' : '[' + startBit + ':' + endBit + ']';
  }

  function formatModuleRange(startIndex, endIndex) {
    if (typeof startIndex !== 'number' || typeof endIndex !== 'number') return '';
    return startIndex === endIndex ? 'M' + startIndex : 'M' + startIndex + '-M' + endIndex;
  }

  function formatBitChunks(startBit, bitString) {
    const chunks = [];
    for (let offset = 0; offset < bitString.length; offset += 8) {
      const endOffset = Math.min(offset + 8, bitString.length) - 1;
      chunks.push(formatBitRange(startBit + offset, startBit + endOffset) + ' ' + bitString.slice(offset, endOffset + 1));
    }
    return chunks.join('<br>');
  }

  function formatValueBytes(byteValues) {
    if (!byteValues || !byteValues.length) return '—';
    return byteValues.map(function (value) {
      return '0x' + formatHexByte(value);
    }).join(' ');
  }

  function formatValueSummary(value) {
    if (value.kind === 'mode') return 'Byte mode indicator';
    if (value.kind === 'count') return value.summary;
    if (value.kind === 'payload') return value.charLabel + ' · ' + formatValueBytes(value.byteValues);
    if (value.kind === 'terminator') return 'Terminator zeros';
    if (value.kind === 'padbits') return 'Zero pad to reach the next byte boundary';
    if (value.kind === 'padcw') return 'Pad byte ' + formatValueBytes(value.byteValues);
    return value.summary;
  }

  function getMaskPatternFormula(maskPattern) {
    switch (maskPattern) {
      case 0: return '(row + col) mod 2 = 0';
      case 1: return 'row mod 2 = 0';
      case 2: return 'col mod 3 = 0';
      case 3: return '(row + col) mod 3 = 0';
      case 4: return '(floor(row/2) + floor(col/3)) mod 2 = 0';
      case 5: return '(row*col) mod 2 + (row*col) mod 3 = 0';
      case 6: return '((row*col) mod 2 + (row*col) mod 3) mod 2 = 0';
      case 7: return '((row + col) mod 2 + (row*col) mod 3) mod 2 = 0';
      default: return 'Unknown';
    }
  }

  function buildFormatInfoMarkup(source, options) {
    const config = options || {};
    const info = source && source.formatInfo ? source.formatInfo : source;
    if (!info) return '';

    const maskBits = typeof info.maskBits === 'string' ? info.maskBits : info.bits.slice(2, 5);
    const detail = config.detail || ('Mask option <span class="font-mono">' + escapeHtml(maskBits) + '</span> is stored inside the orange digits of the format string. This is the metadata scanners read to know which mask formula to reverse.');

    const stream = info.bits.split('').map(function (bit, index) {
      const kind = index <= 1 ? 'ecc' : index <= 4 ? 'mask' : 'bch';
      return '<span class="format-bit-char ' + kind + '" title="Bit ' + index + ' · ' + kind.toUpperCase() + '">' + bit + '</span>';
    }).join('');

    return '<div class="format-info-panel">'
      + '<div class="format-bitstream">' + stream + '</div>'
      + '<div class="format-legend">'
      + '<span><i class="format-legend-chip ecc"></i> ECC bits</span>'
      + '<span><i class="format-legend-chip mask"></i> Selected mask bits</span>'
      + '<span><i class="format-legend-chip bch"></i> BCH bits</span>'
      + '</div>'
        + '<div class="format-mask-note mt-2 text-[11px] leading-relaxed text-slate-500">' + detail + '</div>'
      + '</div>';
  }

  function getEncoderApi() {
    return global.QRPeach;
  }

  let debugQrAnalysisRun = 0;

  function buildDebugReportNoticeMarkup(tone, message) {
    const toneClass = tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : tone === 'loading'
        ? 'border-slate-200 bg-white text-slate-500'
        : 'border-slate-200 bg-slate-50 text-slate-600';
    return '<div class="rounded-3xl border px-4 py-3 text-sm ' + toneClass + '">' + escapeHtml(message) + '</div>';
  }

  function buildDebugIdleMarkup(state) {
    const message = state.debugCurrentSvg
      ? 'Choose a debugger action to analyze the current generated QR or an uploaded image.'
      : 'Generate a valid QR preview to enable current-preview debugging, or upload an image to analyze any QR.';
    return '<p class="text-sm text-slate-400">' + escapeHtml(message) + '</p>';
  }

  function clearDebugAnalysis(state, cancelPending) {
    const container = document.getElementById('encoder-debug-report');
    if (cancelPending) {
      debugQrAnalysisRun += 1;
    }
    state.debugBusy = false;
    state.debugHasReport = false;
    if (container) {
      container.innerHTML = buildDebugIdleMarkup(state);
    }
    syncDebugActionButtons(state);
  }

  function renderMaskControl(state) {
    const container = document.getElementById('encoder-mask-control');
    if (!container) return;

    container.innerHTML = '<div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mask Control</div>'
      + '<div class="final-mask-control mt-3">'
      + '<label class="cursor-pointer"><input id="encoder-final-enable-mask" type="checkbox" ' + (state.enableMask ? 'checked' : '') + ' /><span class="text-sm text-slate-600">Enable Mask</span></label>'
      + '<div class="final-mask-control-copy text-xs leading-relaxed text-slate-500">Disabling the mask is helpful when debugging bits, but the mask is required to ensure the QR is well-formed, readable, and decodable.</div>'
      + '</div>';

    const maskToggle = document.getElementById('encoder-final-enable-mask');
    if (maskToggle) {
      maskToggle.addEventListener('change', function () {
        state.enableMask = this.checked;
        state.valueBitMode = this.checked ? 'masked' : 'unmasked';
        renderEncoderPanel(state);
      });
    }
  }

  function buildDownloadFilename(model, format) {
    const safeType = String(model.type || 'qr').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'qr';
    return 'qrpeach-' + safeType + '-v' + model.version + '-' + String(model.ecc || 'm').toLowerCase() + '.' + format;
  }

  function syncDownloadButtons(state) {
    ['svg', 'png', 'jpg'].forEach(function (format) {
      const button = document.getElementById('encoder-download-' + format);
      if (!button) return;
      const enabled = Boolean(state.currentModel && state.currentModel.ok) && !state.downloadBusy;
      button.disabled = !enabled;
      button.textContent = state.downloadBusy && state.downloadFormat === format ? 'Preparing…' : format.toUpperCase();
    });
  }

  async function downloadCurrentQr(state, format) {
    const encoder = getEncoderApi();
    if (!encoder || !state.currentModel || !state.currentModel.ok || state.downloadBusy) return;
    state.downloadBusy = true;
    state.downloadFormat = format;
    syncDownloadButtons(state);
    try {
      await encoder.Generate(Object.assign({}, state.currentModel, {
        enableMask: state.enableMask
      }), format, {
        filename: buildDownloadFilename(state.currentModel, format),
        download: true
      });
    } finally {
      state.downloadBusy = false;
      state.downloadFormat = '';
      syncDownloadButtons(state);
    }
  }

  function syncDebugActionButtons(state) {
    const currentButton = document.getElementById('encoder-debug-current');
    const uploadButton = document.getElementById('encoder-debug-upload');
    const clearButton = document.getElementById('encoder-debug-clear');
    const uploadInput = document.getElementById('encoder-debug-upload-input');
    const canDebugCurrent = Boolean(state.debugCurrentSvg) && !state.debugBusy;

    if (currentButton) {
      currentButton.disabled = !canDebugCurrent;
      currentButton.classList.toggle('bg-slate-900', canDebugCurrent);
      currentButton.classList.toggle('hover:bg-slate-800', canDebugCurrent);
      currentButton.classList.toggle('text-white', canDebugCurrent);
      currentButton.classList.toggle('bg-slate-300', !canDebugCurrent);
      currentButton.classList.toggle('text-slate-500', !canDebugCurrent);
      currentButton.classList.toggle('cursor-not-allowed', !canDebugCurrent);
    }

    if (uploadButton) {
      uploadButton.disabled = state.debugBusy;
      uploadButton.classList.toggle('opacity-60', state.debugBusy);
      uploadButton.classList.toggle('cursor-not-allowed', state.debugBusy);
    }

    if (uploadInput) {
      uploadInput.disabled = state.debugBusy;
    }

    if (clearButton) {
      clearButton.disabled = state.debugBusy || !state.debugHasReport;
      clearButton.classList.toggle('opacity-50', state.debugBusy || !state.debugHasReport);
      clearButton.classList.toggle('cursor-not-allowed', state.debugBusy || !state.debugHasReport);
    }
  }

  function getDebugIssueTone(severity) {
    if (severity === 'error') return 'border-rose-200 bg-rose-50 text-rose-800';
    if (severity === 'warning') return 'border-amber-200 bg-amber-50 text-amber-800';
    return 'border-slate-200 bg-slate-50 text-slate-700';
  }

  function inferDebugPayloadType(decodedText) {
    const text = String(decodedText || '').trim();
    if (!text) return 'Unknown';
    if (/^BEGIN:VCALENDAR/i.test(text)) return 'Event';
    if (/^BEGIN:VCARD/i.test(text)) return 'vCard';
    if (/^mailto:/i.test(text)) return 'Email';
    if (/^tel:/i.test(text)) return 'Phone';
    if (/^SMSTO:/i.test(text)) return 'SMS';
    if (/^MECARD:/i.test(text)) return 'Contact';
    if (/^WIFI:/i.test(text)) return 'Wi-Fi';
    if (/^geo:/i.test(text)) return 'Geo';
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(text) || /^www\./i.test(text)) return 'URL';
    if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return 'Generic URI';
    return 'Text';
  }

  function buildDebugExplainLink(anchorId) {
    return '<a href="learn.html#' + anchorId + '" class="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700 transition hover:border-orange-300 hover:bg-orange-100">Explain This</a>';
  }

  function buildDebugExplainRow(label, valueMarkup, anchorId, cellClass) {
    const valueClass = cellClass ? ' class="' + cellClass + '"' : '';
    return '<tr><th>' + escapeHtml(label) + '</th><td' + valueClass + '>' + valueMarkup + '</td><td class="align-top text-right whitespace-nowrap">' + buildDebugExplainLink(anchorId) + '</td></tr>';
  }

  function buildDebugQrReportMarkup(result) {
    const image = result.image;
    const symbol = result.symbol;

    function formatHexByte(value) {
      return value.toString(16).toUpperCase().padStart(2, '0');
    }

    function groupBits(bits, groupSize) {
      if (!bits) return '';
      const groups = [];
      for (let index = 0; index < bits.length; index += groupSize) {
        groups.push(bits.slice(index, index + groupSize));
      }
      return groups.join(' ');
    }

    function buildBitPanel(title, subtitle, bits) {
      return '<div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">'
        + '<div class="text-xs font-semibold uppercase tracking-wide text-slate-500">' + escapeHtml(title) + '</div>'
        + '<div class="mt-1 text-[11px] leading-5 text-slate-500">' + escapeHtml(subtitle) + '</div>'
        + '<pre class="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-5 text-slate-700 m-0">' + (bits ? escapeHtml(groupBits(bits, 8)) : '<span class="text-slate-400">Unavailable</span>') + '</pre>'
        + '</div>';
    }

    const quietZone = image && image.quietZone
      ? 'L' + image.quietZone.left + ' / T' + image.quietZone.top + ' / R' + image.quietZone.right + ' / B' + image.quietZone.bottom + ' px'
      : 'Unavailable';
    const quietZoneModules = image && image.quietZoneModules
      ? 'L' + image.quietZoneModules.left.toFixed(2) + ' / T' + image.quietZoneModules.top.toFixed(2) + ' / R' + image.quietZoneModules.right.toFixed(2) + ' / B' + image.quietZoneModules.bottom.toFixed(2) + ' modules'
      : 'Unavailable';
    const modulePitch = image && image.modulePitch
      ? image.modulePitch.x.toFixed(2) + ' x ' + image.modulePitch.y.toFixed(2) + ' px'
      : 'Unavailable';
    const dataType = inferDebugPayloadType(result.decodedText);
    const dataByteCount = symbol && symbol.codewords && symbol.codewords.data
      ? symbol.codewords.data.length
      : null;
    const eccByteCount = symbol && symbol.codewords && symbol.codewords.ecc
      ? symbol.codewords.ecc.length
      : null;
    const totalByteCount = dataByteCount !== null && eccByteCount !== null
      ? dataByteCount + eccByteCount
      : null;
    const padByteCount = symbol && symbol.byteMode && symbol.byteMode.padCodewords
      ? symbol.byteMode.padCodewords.length
      : null;
    const remainderBitCount = symbol && symbol.bitCounts
      ? symbol.bitCounts.remainder
      : null;
    const formatInfoMarkup = symbol && symbol.formatInfo
      ? buildFormatInfoMarkup(symbol.formatInfo, {
          detail: 'Mask option <span class="font-mono">' + escapeHtml(symbol.formatInfo.bits.slice(2, 5)) + '</span> is stored inside the orange digits of the recovered format string. Copy A errors: ' + symbol.formatInfo.copyA.errorBits + ' · Copy B errors: ' + symbol.formatInfo.copyB.errorBits + '.'
        })
      : '';
    const issues = result.issues.length
      ? result.issues.map(function (issue) {
          return '<div class="rounded-2xl border px-4 py-3 ' + getDebugIssueTone(issue.severity) + '">'
            + '<div class="text-[11px] font-semibold uppercase tracking-wide">' + escapeHtml(issue.severity) + ' · ' + escapeHtml(issue.code) + '</div>'
            + '<div class="mt-1 text-sm leading-6">' + escapeHtml(issue.message) + '</div>'
            + (issue.detail ? '<div class="mt-1 text-[11px] leading-5 opacity-80">' + escapeHtml(issue.detail) + '</div>' : '')
            + '</div>';
        }).join('')
      : '<div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">No issues detected by Debug.</div>';
    const debugRows = [
      buildDebugExplainRow('Engine', 'Dependency-free internal matrix scan', 'decoder-pipeline'),
      buildDebugExplainRow('Input', escapeHtml(result.mimeType) + ' · ' + result.byteLength.toLocaleString() + ' bytes', 'decoder-image-source', 'font-mono'),
      buildDebugExplainRow('Image', image ? (image.width + 'x' + image.height) : 'Unavailable', 'decoder-image-source', 'font-mono'),
      buildDebugExplainRow('Version', symbol ? ('V' + symbol.version) : 'Unavailable', 'version-ecc-tradeoffs', 'font-mono'),
      buildDebugExplainRow('ECC Level', symbol ? escapeHtml(symbol.eccLevel) : 'Unavailable', 'format-ecc-level-reference', 'font-mono'),
      buildDebugExplainRow('Mask Pattern', symbol ? escapeHtml(String(symbol.maskPattern)) : 'Unavailable', 'format-mask-pattern-reference', 'font-mono'),
      buildDebugExplainRow('Module Size', symbol ? (symbol.moduleCount + 'x' + symbol.moduleCount) : 'Unavailable', 'version-ecc-tradeoffs', 'font-mono'),
      buildDebugExplainRow('Data Type', escapeHtml(dataType), 'payload-types'),
      buildDebugExplainRow('Decoded Payload', result.decodedText ? '<div class="font-mono text-[11px] leading-relaxed break-all">' + escapeHtml(result.decodedText) + '</div>' : '<span class="text-slate-400">None</span>', 'payload-types'),
      buildDebugExplainRow('Total Bytes', totalByteCount === null ? 'Unavailable' : String(totalByteCount), 'ecc-byte-counts', 'font-mono tabular-nums'),
      buildDebugExplainRow('Data Bytes', dataByteCount === null ? 'Unavailable' : String(dataByteCount), 'bitstream-composition', 'font-mono tabular-nums'),
      buildDebugExplainRow('ECC Bytes', eccByteCount === null ? 'Unavailable' : String(eccByteCount), 'ecc-byte-counts', 'font-mono tabular-nums'),
      buildDebugExplainRow('Pad Bytes', padByteCount === null ? 'Unavailable' : String(padByteCount), 'bitstream-composition', 'font-mono tabular-nums'),
      buildDebugExplainRow('Remainder Bits', remainderBitCount === null ? 'Unavailable' : String(remainderBitCount), 'remainder-bits', 'font-mono tabular-nums'),
      buildDebugExplainRow('Contrast', image ? image.contrast.toFixed(1) : 'Unavailable', 'decoder-contrast-threshold', 'font-mono'),
      buildDebugExplainRow('Module Pitch', modulePitch, 'decoder-module-pitch', 'font-mono text-[11px] leading-relaxed'),
      buildDebugExplainRow('Quiet Zone', quietZone + '<div class="mt-1 text-slate-500">' + quietZoneModules + '</div>', 'decoder-quiet-zone', 'font-mono text-[11px] leading-relaxed'),
      buildDebugExplainRow('Bit Split', symbol ? (symbol.bitCounts.data + ' data · ' + symbol.bitCounts.ecc + ' ecc · ' + symbol.bitCounts.remainder + ' remainder') : 'Unavailable', 'bitstream-composition', 'font-mono text-[11px] leading-relaxed'),
      buildDebugExplainRow('Format Bits', formatInfoMarkup || '<span class="text-slate-400">Unavailable</span>', 'format-information'),
      buildDebugExplainRow('Mode + Count', symbol ? escapeHtml(symbol.byteMode.modeBits + ' · ' + symbol.byteMode.countBits + ' (' + symbol.byteMode.byteCount + ' bytes)') : 'Unavailable', 'bitstream-composition', 'font-mono text-[11px] leading-relaxed')
    ].join('');

    return '<div class="mt-4 rounded-3xl border border-slate-200 bg-white p-4">'
      + '<div class="flex items-start justify-between gap-3 flex-wrap">'
      + '<div><div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Debug Virtual Scan</div><div class="mt-1 text-sm text-slate-600">' + escapeHtml(result.sourceLabel || 'Current live preview') + '</div></div>'
      + '<div class="text-sm font-semibold ' + (result.ok ? 'text-emerald-700' : 'text-rose-700') + '">' + (result.ok ? 'Internal scan passed' : 'Issues found') + '</div>'
      + '</div>'
      + '<table class="anno-table text-sm w-full mt-4">' + debugRows + '</table>'
      + (symbol && symbol.versionInfo
        ? '<div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Version Bits</div><div class="mt-1 font-mono text-[11px] leading-5 text-slate-700">' + escapeHtml(symbol.versionInfo.bits) + '</div><div class="mt-1 text-[11px] leading-5 text-slate-500">Copy A errors: ' + symbol.versionInfo.copyA.errorBits + ' · Copy B errors: ' + symbol.versionInfo.copyB.errorBits + '</div></div>'
        : '')
      + (symbol
        ? '<div class="mt-4 grid gap-3 md:grid-cols-2">'
          + buildBitPanel('Metadata Bits', 'Format bits plus version bits when present.', symbol.bitstreams.metadata)
          + buildBitPanel('Data Bits', 'Recovered byte-mode data stream after mask removal.', symbol.bitstreams.data)
          + buildBitPanel('ECC Bits', 'Recovered Reed-Solomon error-correction bitstream.', symbol.bitstreams.ecc)
          + buildBitPanel('Remainder Bits', 'Trailing structural zeros after all codewords.', symbol.bitstreams.remainder)
          + '</div>'
        : '')
      + '<div class="mt-4 grid gap-3">' + issues + '</div>'
      + '</div>';
  }

  async function runDebugQrAnalysis(imageBytes, options, state) {
    const encoder = getEncoderApi();
    const container = document.getElementById('encoder-debug-report');
    if (!container || !encoder || typeof encoder.Debug !== 'function') return;

    const runId = ++debugQrAnalysisRun;
    state.debugBusy = true;
    syncDebugActionButtons(state);
    container.innerHTML = buildDebugReportNoticeMarkup('loading', options.loadingMessage || 'Analyzing QR image...');

    try {
      const result = await encoder.Debug(imageBytes, options.debugOptions || {});
      if (runId !== debugQrAnalysisRun) return;
      state.debugHasReport = true;
      container.innerHTML = buildDebugQrReportMarkup(result);
    } catch (error) {
      if (runId !== debugQrAnalysisRun) return;
      state.debugHasReport = true;
      container.innerHTML = buildDebugReportNoticeMarkup('error', 'Debug failed: ' + (error && error.message ? error.message : 'Unknown error.'));
    } finally {
      if (runId !== debugQrAnalysisRun) return;
      state.debugBusy = false;
      syncDebugActionButtons(state);
    }
  }

  async function debugCurrentGeneratedQr(state) {
    const svgMarkup = state.debugCurrentSvg;
    if (!svgMarkup) {
      clearDebugAnalysis(state, false);
      return;
    }

    await runDebugQrAnalysis(new TextEncoder().encode(svgMarkup), {
      loadingMessage: 'Analyzing the current QR preview...',
      debugOptions: {
        mimeType: 'image/svg+xml',
        sourceLabel: state.enableMask ? 'Current masked live preview' : 'Current live preview with masking disabled'
      }
    }, state);
  }

  async function debugUploadedQr(file, state) {
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    await runDebugQrAnalysis(bytes, {
      loadingMessage: 'Analyzing uploaded QR image...',
      debugOptions: {
        mimeType: file.type || '',
        sourceLabel: 'Uploaded image: ' + file.name
      }
    }, state);
  }

  function bindTooltip() {
    const tooltip = document.getElementById('qr-tooltip');
    if (!tooltip || tooltip.dataset.bound === 'true') return;
    tooltip.dataset.bound = 'true';

    document.addEventListener('mouseover', function (event) {
      if (event.target.classList.contains('tip-rect')) {
        tooltip.textContent = event.target.dataset.tip;
        tooltip.style.display = 'block';
      }
    });

    document.addEventListener('mousemove', function (event) {
      if (tooltip.style.display === 'block') {
        let x = event.clientX + 14;
        let y = event.clientY + 14;
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        if (x + tw > window.innerWidth - 8) x = event.clientX - tw - 10;
        if (y + th > window.innerHeight - 8) y = event.clientY - th - 10;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      }
    });

    document.addEventListener('mouseout', function (event) {
      if (event.target.classList.contains('tip-rect')) {
        tooltip.style.display = 'none';
      }
    });
  }

  function createState() {
    // Keep all mutable UI state in one place so render paths can stay pure.
    return {
      type: 'text',
      inputs: deepClone(DEFAULT_INPUTS),
      version: 2,
      versionLocked: false,
      ecc: 'M',
      zoom: 180,
      showCombinedLabels: true,
      showValueBits: true,
      valueBitMode: 'masked',
      enableMask: true,
      currentModel: null,
      downloadBusy: false,
      downloadFormat: '',
      debugCurrentSvg: '',
      debugBusy: false,
      debugHasReport: false
    };
  }

  function syncVersionSelect(state) {
    const versionSelect = document.getElementById('encoder-version');
    if (!versionSelect) return;
    const nextValue = state.versionLocked ? String(state.version) : 'auto';
    if (versionSelect.value !== nextValue) {
      versionSelect.value = nextValue;
    }
  }

  function inferAutoSizedModel(encoder, state) {
    let lastModel = null;
    for (let version = 1; version <= 40; version++) {
      const candidate = encoder.Generate({
        type: state.type,
        inputs: state.inputs[state.type],
        version: version,
        ecc: state.ecc,
        enableMask: state.enableMask
      });
      lastModel = candidate;
      if (candidate.ok) {
        return { version: version, model: candidate };
      }
    }
    return { version: 40, model: lastModel };
  }

  function syncValueModeControls(state) {
    const group = document.getElementById('encoder-value-mode-group');
    if (!group) return;
    const radios = group.querySelectorAll('input[type="radio"]');
    for (const radio of radios) {
      radio.disabled = !state.showValueBits;
      radio.checked = radio.value === state.valueBitMode;
    }
    group.style.opacity = state.showValueBits ? '1' : '0.5';
  }

  function renderTypeFields(state, payloadInfo) {
    const help = document.getElementById('encoder-type-help');
    const fields = document.getElementById('encoder-type-fields');
    const preview = document.getElementById('encoder-payload-preview');
    const type = state.type;

    help.innerHTML = '\n      <div class="rounded-2xl border border-indigo-100 bg-white px-4 py-3">\n        <div class="text-xs font-semibold uppercase tracking-wide text-indigo-700">' + escapeHtml(payloadInfo.typeLabel) + ' Payload</div>\n        <p class="mt-1 text-sm text-slate-600 leading-relaxed">' + escapeHtml(payloadInfo.description) + '</p>\n        <p class="mt-2 text-[11px] text-slate-500">Scanner rule: ' + escapeHtml(payloadInfo.scannerRule) + '</p>\n      </div>\n    ';

    if (type === 'uri' || type === 'url') {
      const uriInputs = state.inputs[type];
      const fieldLabel = type === 'uri' ? 'URI' : 'URL';
      const placeholder = type === 'uri' ? 'sip:ada@example.com' : 'https://example.com';
      fields.innerHTML = '\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">' + fieldLabel + '</span>\n          <input data-field="value" type="text" value="' + escapeHtml(uriInputs.value) + '" placeholder="' + placeholder + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n      ';
    } else if (type === 'email') {
      fields.innerHTML = '\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Address</span>\n          <input data-field="address" type="email" value="' + escapeHtml(state.inputs.email.address) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Subject</span>\n          <input data-field="subject" type="text" value="' + escapeHtml(state.inputs.email.subject) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Body</span>\n          <textarea data-field="body" rows="3" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false">' + escapeHtml(state.inputs.email.body) + '</textarea>\n        </label>\n      ';
    } else if (type === 'phone') {
      fields.innerHTML = '\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Phone Number</span>\n          <input data-field="number" type="text" value="' + escapeHtml(state.inputs.phone.number) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n      ';
    } else if (type === 'sms') {
      fields.innerHTML = '\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Phone Number</span>\n          <input data-field="number" type="text" value="' + escapeHtml(state.inputs.sms.number) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Message</span>\n          <textarea data-field="message" rows="3" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false">' + escapeHtml(state.inputs.sms.message) + '</textarea>\n        </label>\n      ';
    } else if (type === 'contact' || type === 'vcard') {
      const contactInputs = state.inputs[type];
      fields.innerHTML = '\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Name</span>\n          <input data-field="name" type="text" value="' + escapeHtml(contactInputs.name) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Organization</span>\n          <input data-field="org" type="text" value="' + escapeHtml(contactInputs.org) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Phone</span>\n          <input data-field="phone" type="text" value="' + escapeHtml(contactInputs.phone) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Email</span>\n          <input data-field="email" type="email" value="' + escapeHtml(contactInputs.email) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">URL</span>\n          <input data-field="url" type="text" value="' + escapeHtml(contactInputs.url) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Note</span>\n          <textarea data-field="note" rows="2" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false">' + escapeHtml(contactInputs.note) + '</textarea>\n        </label>\n      ';
    } else if (type === 'event') {
      const eventInputs = state.inputs.event;
      const useDateOnly = Boolean(eventInputs.allDay);
      fields.innerHTML = '\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Title</span>\n          <input data-field="title" type="text" value="' + escapeHtml(eventInputs.title) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 md:col-span-2">\n          <input data-field="allDay" type="checkbox" ' + (eventInputs.allDay ? 'checked' : '') + ' />\n          <span>All-day event</span>\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">' + (useDateOnly ? 'Start Date' : 'Start') + '</span>\n          <input data-field="start" type="' + (useDateOnly ? 'date' : 'datetime-local') + '" value="' + escapeHtml(eventInputs.start) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">' + (useDateOnly ? 'End Date (Inclusive)' : 'End') + '</span>\n          <input data-field="end" type="' + (useDateOnly ? 'date' : 'datetime-local') + '" value="' + escapeHtml(eventInputs.end) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Location</span>\n          <input data-field="location" type="text" value="' + escapeHtml(eventInputs.location) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Description</span>\n          <textarea data-field="description" rows="3" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false">' + escapeHtml(eventInputs.description) + '</textarea>\n        </label>\n      ';
    } else if (type === 'wifi') {
      fields.innerHTML = '\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">SSID</span>\n          <input data-field="ssid" type="text" value="' + escapeHtml(state.inputs.wifi.ssid) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Encryption</span>\n          <select data-field="encryption" class="w-full px-3 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">\n            <option value="WPA" ' + (state.inputs.wifi.encryption === 'WPA' ? 'selected' : '') + '>WPA/WPA2</option>\n            <option value="WEP" ' + (state.inputs.wifi.encryption === 'WEP' ? 'selected' : '') + '>WEP</option>\n            <option value="nopass" ' + (state.inputs.wifi.encryption === 'nopass' ? 'selected' : '') + '>Open / No Password</option>\n          </select>\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Password</span>\n          <input data-field="password" type="text" value="' + escapeHtml(state.inputs.wifi.password) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" ' + (state.inputs.wifi.encryption === 'nopass' ? 'disabled' : '') + ' />\n        </label>\n        <label class="flex items-center gap-2 cursor-pointer md:col-span-2 text-sm text-slate-600">\n          <input data-field="hidden" type="checkbox" ' + (state.inputs.wifi.hidden ? 'checked' : '') + ' />\n          <span>Hidden network</span>\n        </label>\n      ';
    } else if (type === 'geo') {
      fields.innerHTML = '\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Latitude</span>\n          <input data-field="lat" type="text" value="' + escapeHtml(state.inputs.geo.lat) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Longitude</span>\n          <input data-field="lng" type="text" value="' + escapeHtml(state.inputs.geo.lng) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Optional Query</span>\n          <input data-field="query" type="text" value="' + escapeHtml(state.inputs.geo.query) + '" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false" />\n        </label>\n      ';
    } else {
      fields.innerHTML = '\n        <label class="block md:col-span-2">\n          <span class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Text</span>\n          <textarea data-field="value" rows="4" class="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl resize-y font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" spellcheck="false">' + escapeHtml(state.inputs.text.value) + '</textarea>\n        </label>\n      ';
    }

    preview.innerHTML = '\n      <div class="flex items-start justify-between gap-3 mb-2">\n        <div>\n          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Encoded Payload</div>\n          <div class="text-[11px] text-slate-500 mt-1">Envelope: ' + escapeHtml(payloadInfo.envelope) + '</div>\n        </div>\n        <div class="text-[11px] text-slate-500 max-w-[220px] text-right">Scanners infer the selected type from the payload string itself, not from a dedicated QR structural mode.</div>\n      </div>\n      <pre class="font-mono text-[12px] leading-6 text-slate-700 whitespace-pre-wrap break-all m-0">' + escapeHtml(payloadInfo.payload) + '</pre>\n    ';
  }

  function renderEncoderVersionProfile(state, model) {
    const info = model.versionInfo;
    document.getElementById('encoder-version-headline').innerHTML = info.size + 'x' + info.size + ' modules · ' + info.alignmentPatternCount + ' alignment pattern' + (info.alignmentPatternCount !== 1 ? 's' : '') + ' · ' + (info.hasVersionInfo ? 'Version info present' : 'No version info');
    document.getElementById('encoder-specs').innerHTML = '\n      <table class="anno-table text-sm w-full">\n        <tr><th>Version</th><td class="font-mono">' + info.version + '</td></tr>\n        <tr><th>Module Size</th><td class="font-mono">' + info.size + 'x' + info.size + '</td></tr>\n        <tr><th>Total Modules</th><td class="font-mono tabular-nums">' + info.totalModules.toLocaleString() + '</td></tr>\n        <tr><th>Alignment Patterns</th><td class="font-mono tabular-nums">' + info.alignmentPatternCount + '</td></tr>\n        <tr><th>Version Information</th><td>' + (info.hasVersionInfo ? '<span class="text-emerald-700 font-semibold">Yes</span>' : '<span class="text-slate-400">No</span>') + '</td></tr>\n        <tr><th>Total Bytes</th><td class="font-mono tabular-nums">' + info.totalCodewords + '</td></tr>\n        <tr><th>Remainder Bits</th><td class="font-mono tabular-nums">' + info.remainderBits + '</td></tr>\n      </table>\n    ';

    const eccRows = ['L', 'M', 'Q', 'H'].map(function (key) {
      const label = key + (key === 'L' ? ' (~7%)' : key === 'M' ? ' (~15%)' : key === 'Q' ? ' (~25%)' : ' (~30%)');
      return '\n        <tr>\n          <th>' + label + '</th>\n          <td class="font-mono tabular-nums ' + (key === state.ecc ? 'text-indigo-700 font-semibold' : '') + '">' + info.eccProfile[key] + '</td>\n        </tr>\n      ';
    }).join('');
    document.getElementById('encoder-ecc-profile').innerHTML = '<table class="anno-table text-sm w-full">' + eccRows + '</table>';

  }

  function renderEncoderLegend(model) {
    document.getElementById('encoder-legend').innerHTML = '\n      <span class="legend-item"><span class="path-swatch" style="background:#dbeafe"></span> Data region</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#1e293b"></span> Finder patterns + dark module</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#ffffff;border:1px solid #cbd5e1"></span> Light modules inside finder/alignment patterns</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#e2e8f0"></span> Separators</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#f59e0b"></span> Timing patterns</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#10b981"></span> Alignment patterns</span>\n      <span class="legend-item"><span class="path-swatch" style="background:#ef4444"></span> Format information</span>\n      ' + (model.version >= 7 ? '<span class="legend-item"><span class="path-swatch" style="background:#8b5cf6"></span> Version information</span>' : '') + '\n      <span class="text-[10px]" style="color:#92400e;">The solid module fills show structural QR regions. Labels and value badges are separate overlays drawn on top.</span>\n    ';
  }

  function renderFinalQrPreview(state, model) {
    const qrContainer = document.getElementById('encoder-final-qr');
    const metaContainer = document.getElementById('encoder-final-meta');
    const metaExtraContainer = document.getElementById('encoder-final-meta-extra');
    const debugContainer = document.getElementById('encoder-debug-report');
    if (!model.ok) {
      state.currentModel = null;
      state.debugCurrentSvg = '';
      qrContainer.innerHTML = '<div class="text-sm text-slate-400 text-center max-w-xs">The final symbol will appear here once the payload fits in the selected version and ECC level.</div>';
      if (metaContainer) {
        metaContainer.innerHTML = '<p class="text-sm text-slate-400">No final QR symbol is generated until the payload fits the selected capacity.</p>';
      }
      if (metaExtraContainer) {
        metaExtraContainer.innerHTML = '<p class="text-sm text-slate-400">Additional format and payload details appear here once a valid QR preview is generated.</p>';
      }
      if (debugContainer && !state.debugHasReport) {
        debugContainer.innerHTML = buildDebugIdleMarkup(state);
      }
      syncDownloadButtons(state);
      syncDebugActionButtons(state);
      return;
    }

    const formatInfoMarkup = buildFormatInfoMarkup(model.finalQr);
    const maskFormula = getMaskPatternFormula(model.finalQr.maskPattern);
    const finalSvg = global.QRPeachDiagram.buildFinalQrSvg(model.finalQr, 320);
    state.currentModel = model;
    state.debugCurrentSvg = finalSvg;
    qrContainer.innerHTML = finalSvg;
    if (metaContainer) {
      metaContainer.innerHTML = '\n      <table class="anno-table text-sm w-full">\n        <tr><th>QR Type</th><td>' + escapeHtml(model.payloadInfo.typeLabel) + '</td></tr>\n        <tr><th>Envelope</th><td class="font-mono">' + escapeHtml(model.payloadInfo.envelope) + '</td></tr>\n        <tr><th>Payload Mode</th><td class="font-mono">Byte / UTF-8</td></tr>\n        <tr><th>UTF-8 Bytes</th><td class="font-mono tabular-nums">' + model.payloadBytes.length + '</td></tr>\n        <tr><th>Byte Count Field</th><td class="font-mono tabular-nums">' + model.countBits + ' bits</td></tr>\n        <tr><th>Payload Bits</th><td class="font-mono tabular-nums">' + (model.payloadBitLength || 0) + '</td></tr>\n        <tr><th>Data Bytes</th><td class="font-mono tabular-nums">' + model.dataBytes + '</td></tr>\n        <tr><th>ECC Bytes</th><td class="font-mono tabular-nums">' + model.eccBytes + '</td></tr>\n        <tr><th>Pad Bytes</th><td class="font-mono tabular-nums">' + model.padByteCount + '</td></tr>\n      </table>\n    ';
    }

    if (metaExtraContainer) {
      metaExtraContainer.innerHTML = '\n        <table class="anno-table text-sm w-full">\n          <tr><th>Mask Pattern</th><td class="font-mono">' + (model.finalQr.maskPattern === null ? 'Unknown' : model.finalQr.maskPattern) + '</td></tr>\n          <tr><th>Mask Formula</th><td class="font-mono text-[11px] leading-relaxed">' + escapeHtml(maskFormula) + '</td></tr>\n          <tr><th>Format Bits</th><td>' + formatInfoMarkup + '</td></tr>\n          <tr><th>Encoded Payload</th><td><div class="font-mono text-[11px] leading-relaxed break-all">' + escapeHtml(model.payloadText) + '</div></td></tr>\n        </table>\n      ';
    }

    if (debugContainer && !state.debugHasReport) {
      debugContainer.innerHTML = buildDebugIdleMarkup(state);
    }
    syncDownloadButtons(state);
    syncDebugActionButtons(state);
  }

  function renderEncoderPanel(state) {
    const encoder = getEncoderApi();
    if (state.debugHasReport || state.debugBusy) {
      state.debugCurrentSvg = '';
      clearDebugAnalysis(state, true);
    }
    let model;
    if (state.versionLocked) {
      model = encoder.Generate({
        type: state.type,
        inputs: state.inputs[state.type],
        version: state.version,
        ecc: state.ecc,
        enableMask: state.enableMask
      });
    } else {
      const inferred = inferAutoSizedModel(encoder, state);
      state.version = inferred.version;
      model = inferred.model;
    }

    syncVersionSelect(state);

    renderTypeFields(state, model.payloadInfo);

    renderEncoderLegend(model);
    renderFinalQrPreview(state, model);
  renderMaskControl(state);

    const status = document.getElementById('encoder-status');
    if (model.ok) {
      const heading = state.versionLocked
        ? 'Fits in version ' + state.version + ' / ECC ' + state.ecc
        : 'Auto-sized to version ' + state.version + ' / ECC ' + state.ecc;
      const reason = state.versionLocked
        ? ' Auto-size infer was not used because you explicitly selected version ' + state.version + '.'
        : ' QR Peach inferred the smallest version that fits because the version control is still in Auto mode.';
      status.innerHTML = '<div class="text-emerald-700 font-semibold">' + heading + '</div><p class="mt-2 text-slate-600">' + escapeHtml(model.payloadInfo.typeLabel) + ' payload produces ' + model.payloadBytes.length + ' UTF-8 byte' + (model.payloadBytes.length !== 1 ? 's' : '') + ', ' + model.values.length + ' bitstream values, and ' + model.dataBytes + ' data bytes before ECC is generated.' + reason + ' Hover a highlighted module to inspect the exact source bit.</p>';
    } else {
      const suggestionText = model.suggestion ? ' Smallest version at ECC ' + state.ecc + ': V' + model.suggestion + '.' : '';
      const reason = state.versionLocked
        ? ' Auto-size infer was not used because you explicitly selected version ' + state.version + '.'
        : ' Auto-size infer checked the available versions but the payload still did not fit.';
      status.innerHTML = '<div class="text-rose-700 font-semibold">Payload does not fit</div><p class="mt-2 text-slate-600">' + escapeHtml(model.error) + suggestionText + reason + '</p>';
    }

    const baseWidth = Math.min(560, Math.max(model.versionInfo.size * 2, Math.floor(560 / model.versionInfo.size) * model.versionInfo.size));
    const renderWidth = Math.round(baseWidth * (state.zoom / 100));
    document.getElementById('encoder-diagram').innerHTML = global.QRPeachDiagram.buildOverlaySvg(model, renderWidth, {
      showData: true,
      showEcc: true,
      showRemainder: true,
      showLabels: true,
      showCWLabels: false,
      showValueSpans: true,
      showCombinedLabels: state.showCombinedLabels,
      showValueBits: state.showValueBits,
      valueBitMode: state.valueBitMode,
      encoderOverlay: model.ok ? model : null
    });
    syncValueModeControls(state);
  }

  function initLiveEncoderPage() {
    const encoder = getEncoderApi();
    if (!encoder || !global.QRPeachDiagram) return;
    bindTooltip();

    const state = createState();
    const versionSelect = document.getElementById('encoder-version');
    const typeSelect = document.getElementById('encoder-type');
    const debugCurrentButton = document.getElementById('encoder-debug-current');
    const debugUploadButton = document.getElementById('encoder-debug-upload');
    const debugClearButton = document.getElementById('encoder-debug-clear');
    const debugUploadInput = document.getElementById('encoder-debug-upload-input');
    if (!versionSelect || !typeSelect) return;

    ['svg', 'png', 'jpg'].forEach(function (format) {
      const button = document.getElementById('encoder-download-' + format);
      if (!button) return;
      button.addEventListener('click', function () {
        downloadCurrentQr(state, format);
      });
    });

    const autoOption = document.createElement('option');
    autoOption.value = 'auto';
    autoOption.textContent = 'Auto (smallest that fits)';
    if (!state.versionLocked) autoOption.selected = true;
    versionSelect.appendChild(autoOption);

    for (let version = 1; version <= 40; version++) {
      const option = document.createElement('option');
      option.value = String(version);
      option.textContent = 'Version ' + version + ' (' + (17 + 4 * version) + '×' + (17 + 4 * version) + ')';
      if (state.versionLocked && version === state.version) option.selected = true;
      versionSelect.appendChild(option);
    }

    typeSelect.addEventListener('change', function () {
      state.type = this.value;
      renderEncoderPanel(state);
    });

    const typeFieldsContainer = document.getElementById('encoder-type-fields');
    const syncTypedField = function (target) {
      const field = target.dataset.field;
      if (!field) return;
      const currentInputs = state.inputs[state.type];
      currentInputs[field] = target.type === 'checkbox' ? target.checked : target.value;
      renderEncoderPanel(state);
    };
    typeFieldsContainer.addEventListener('input', function (event) {
      syncTypedField(event.target);
    });
    typeFieldsContainer.addEventListener('change', function (event) {
      syncTypedField(event.target);
    });

    versionSelect.addEventListener('change', function () {
      if (this.value === 'auto') {
        state.versionLocked = false;
      } else {
        state.versionLocked = true;
        state.version = parseInt(this.value, 10);
      }
      renderEncoderPanel(state);
    });
    document.getElementById('encoder-ecc').addEventListener('change', function () {
      state.ecc = this.value;
      renderEncoderPanel(state);
    });
    document.getElementById('encoder-show-labels').addEventListener('change', function () {
      state.showCombinedLabels = this.checked;
      renderEncoderPanel(state);
    });
    document.getElementById('encoder-show-values').addEventListener('change', function () {
      state.showValueBits = this.checked;
      renderEncoderPanel(state);
    });
    document.querySelectorAll('input[name="encoder-value-mode"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (!this.checked) return;
        state.valueBitMode = this.value;
        renderEncoderPanel(state);
      });
    });
    document.getElementById('encoder-zoom').addEventListener('input', function () {
      state.zoom = parseInt(this.value, 10);
      document.getElementById('encoder-zoom-label').textContent = this.value + '%';
      renderEncoderPanel(state);
    });

    if (debugCurrentButton) {
      debugCurrentButton.addEventListener('click', function () {
        debugCurrentGeneratedQr(state);
      });
    }
    if (debugUploadButton && debugUploadInput) {
      debugUploadButton.addEventListener('click', function () {
        if (state.debugBusy) return;
        debugUploadInput.click();
      });
      debugUploadInput.addEventListener('change', function () {
        const file = this.files && this.files[0] ? this.files[0] : null;
        this.value = '';
        debugUploadedQr(file, state);
      });
    }
    if (debugClearButton) {
      debugClearButton.addEventListener('click', function () {
        clearDebugAnalysis(state, true);
      });
    }

    renderEncoderPanel(state);
    syncDownloadButtons(state);
  }

  global.initLiveEncoderPage = initLiveEncoderPage;
})(typeof window !== 'undefined' ? window : this);
