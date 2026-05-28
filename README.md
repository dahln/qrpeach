# QR Peach

[![npm version](https://img.shields.io/npm/v/qrpeach?label=npm&style=flat-square&color=0ea5e9)](https://www.npmjs.com/package/qrpeach)
[![jsDelivr hits](https://img.shields.io/jsdelivr/npm/hm/qrpeach?label=jsDelivr&style=flat-square&color=14b8a6)](https://www.jsdelivr.com/package/npm/qrpeach)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](https://github.com/dahln/qrpeach/blob/master/LICENSE)
[![npm package](https://img.shields.io/badge/install-npm%20install%20qrpeach-475569?style=flat-square)](https://www.npmjs.com/package/qrpeach)

[https://orange-sky-048c8d310.7.azurestaticapps.net](https://orange-sky-048c8d310.7.azurestaticapps.net)

QR Peach is a QR reference, interactive encoder, and standalone JavaScript library. It is designed for three kinds of use:

1. Learn how QR codes are structured and why scanners can decode them.
2. Build QR Codes and debug QR Codes.
3. Use the `qrpeach.js` runtime in your own application.

## Package Status

- npm package: https://www.npmjs.com/package/qrpeach
- Install: `npm install qrpeach`
- jsDelivr CDN: `https://cdn.jsdelivr.net/npm/qrpeach@latest/qrpeach.min.js`
- UNPKG CDN: `https://unpkg.com/qrpeach@latest/qrpeach.min.js`
- Direct download: `https://github.com/dahln/qrpeach/releases/latest/download/qrpeach.js`



### Minimal Generate Example

```html
<script src="qrpeach.js"></script>
<script>
	const model = QRPeach.Generate({
		type: 'text',
		inputs: { value: 'HELLO WORLD' },
		version: 2,
		ecc: 'M'
	});

	if (!model.ok) {
		throw new Error(model.error);
	}

	console.log(model.payloadText);
	console.log(model.values);
	console.log(model.finalQr.matrix);
</script>
```

### Public Library Methods

After loading `qrpeach.js`, the library exposes only two public methods:

| Method | Purpose |
| --- | --- |
| `QRPeach.Generate(options, format?, renderOptions?)` | Create a QR model or generate a render-ready SVG, PNG, or JPG asset |
| `QRPeach.Debug(source, options?)` | Return JSON-safe diagnostic output from generation inputs/models or from PNG, JPEG, or SVG image bytes |

### Generate Options

`QRPeach.Generate(options)` accepts these main options:

| Option | Type | Description |
| --- | --- | --- |
| `type` | string | Payload type: `text`, `uri`, `url`, `email`, `phone`, `sms`, `contact`, `vcard`, `event`, `wifi`, or `geo` |
| `inputs` | object | Payload fields for the selected type |
| `version` | number | QR version from `1` to `40` |
| `ecc` | string | ECC level: `L`, `M`, `Q`, or `H` |
| `enableMask` | boolean | Optional. Set to `false` to inspect the unmasked base matrix while still computing the best mask metadata |

### Input Shapes by Payload Type

```js
// text
{ value: 'HELLO WORLD' }

// uri
{ value: 'sip:ada@example.com' }

// url
{ value: 'https://example.com' }

// email
{ address: 'ada@example.com', subject: 'Hello', body: 'Thanks for scanning this QR.' }

// phone
{ number: '+15551234567' }

// sms
{ number: '+15551234567', message: 'Hello from QR Peach' }

// contact
{
	name: 'Ada Lovelace',
	org: 'Analytical Engines',
	phone: '+15551234567',
	email: 'ada@example.com',
	url: 'https://example.com',
	note: 'First programmer'
}

// wifi
{ ssid: 'Cafe WiFi', encryption: 'WPA', password: 'secret123', hidden: false }

// vcard
{
	name: 'Ada Lovelace',
	org: 'Analytical Engines',
	phone: '+15551234567',
	email: 'ada@example.com',
	url: 'https://example.com',
	note: 'First programmer'
}

// event
{
	title: 'QR Peach Demo',
	start: '2026-06-01T09:00',
	end: '2026-06-01T10:00',
	location: 'Main Studio',
	description: 'Walk through the QR payload and symbol structure.',
	allDay: false,
	timezone: 'America/New_York'
}

All-day event example:

```js
{
	title: 'Launch Day',
	start: '2026-06-01',
	end: '2026-06-01',
	allDay: true
}
```

// geo
{ lat: '37.7749', lng: '-122.4194', query: 'Coffee shop' }
```

### What `Generate()` Returns

When generation succeeds, the returned model includes both QR content and explanation metadata.

Useful top-level fields:

- `ok` - whether generation succeeded
- `payloadInfo` - type label, description, scanner rule, normalized inputs, and final payload string
- `payloadText` - the exact encoded payload string
- `payloadBytes` - UTF-8 byte expansion with per-character metadata
- `values` - grouped bitstream segments such as mode, count, payload bytes, terminator, alignment, and pad bytes
- `charMap` - character-to-byte and bit-range mapping
- `dataByteValues` - final data codewords before ECC
- `versionInfo` - size, module count, data/ECC codeword counts, remainder bits, and RS block structure
- `moduleGrid` - semantic map of fixed QR regions
- `zigzagPath` - traversal order through writable modules
- `finalQr` - final symbol output and placement metadata

Useful `finalQr` fields:

- `matrix` - final boolean module matrix
- `maskPattern` - chosen mask pattern from `0` through `7`
- `maskPenalty` - penalty score used when selecting the best mask
- `formatInfo` - final 15-bit format information split into ECC bits, mask bits, and BCH bits
- `rsBlocks` - data and ECC bytes grouped by Reed-Solomon block
- `interleavedCodewords` - final data/ECC interleave order
- `placedBits` - bit-by-bit placement records with row and column positions

When generation fails, the result still includes helpful fields such as `error`, payload metadata, byte counts, and capacity information so you can show a clear message in your own UI.

### Rendering Assets Directly

`Generate()` can also return a render-ready asset so your app does not need to build the SVG, PNG, or JPG itself.

```html
<div id="qr-output"></div>
<script src="qrpeach.js"></script>
<script>
	async function main() {
		const asset = await QRPeach.Generate({
			type: 'wifi',
			inputs: {
				ssid: 'Cafe WiFi',
				encryption: 'WPA',
				password: 'secret123',
				hidden: false
			},
			version: 4,
			ecc: 'M'
		}, 'svg', { download: false });

		document.getElementById('qr-output').innerHTML = asset.svg;
	}

	main();
</script>
```

### Example: Debug Generation Data

```html
<script src="qrpeach.js"></script>
<script>
	async function inspectModel() {
		const model = QRPeach.Generate({
			type: 'email',
			inputs: {
				address: 'ada@example.com',
				subject: 'Hello',
				body: 'Thanks for scanning this QR.'
			},
			version: 3,
			ecc: 'M'
		});

		const debug = await QRPeach.Debug(model);
		console.log(debug.payloadInfo);
		console.log(debug.values);
		console.log(debug.finalQr);
	}
</script>
```

### Example: Run `Debug` on Generated SVG Bytes

```html
<script src="qrpeach.js"></script>
<script>
	async function inspectSvg(svgMarkup) {
		const bytes = new TextEncoder().encode(svgMarkup);
		const report = await QRPeach.Debug(bytes, {
			mimeType: 'image/svg+xml',
			sourceLabel: 'Application-generated SVG'
		});

		console.log(report.ok);
		console.log(report.decodedText);
		console.log(report.issues);
	}
</script>
```

## Practical Workflow

If you are using QR Peach to build or validate QR features in another project, the most effective sequence is:

1. Use `learn.html` to understand the structure you care about.
2. Reproduce the same case in `encoder.html` and inspect the generated payload, version profile, and final matrix.
3. Move that payload type and version/ECC configuration into your own application with `qrpeach.js`.
4. Render the generated asset directly, or use `model.finalQr.matrix` when you need lower-level access.
5. If you need a verification pass, feed your generated SVG, PNG, or JPEG back through `QRPeach.Debug(...)`.

## Notes

- QR Peach builds industry-standard or widely implemented payload envelopes such as URI schemes, `WIFI:`, `MECARD:`, `BEGIN:VCARD`, and `BEGIN:VCALENDAR`, then explains how that final payload is serialized into the QR byte stream.
- The embedded spec tables live inside `qrpeach.js`, so there is no separate JSON sidecar file to load.
- The project is intended to work directly from `file:///` URLs as well as from static hosting.

## Repository

GitHub: https://github.com/dahln/QRPeach
