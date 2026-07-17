/**
 * Génère des PNG simples pour la PWA (pur Node.js, zéro dépendance)
 */
import { deflateSync } from 'zlib'
import { writeFileSync } from 'fs'

function u32(n) {
  const b = Buffer.allocUnsafe(4)
  b.writeUInt32BE(n)
  return b
}

function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const byte of buf) {
    c ^= byte
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  }
  return (c ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type)
  const lenBuf = u32(data.length)
  const crcBuf = u32(crc32(Buffer.concat([typeBytes, data])))
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

function makePNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.concat([
    u32(size), u32(size),
    Buffer.from([8, 2, 0, 0, 0]) // 8-bit depth, RGB, compression=0, filter=0, interlace=0
  ])

  // Image data: un carré coloré avec coins arrondis simulés par transparence
  // On passe en RGBA (type 6) pour pouvoir avoir des coins arrondis
  const ihdr2 = Buffer.concat([
    u32(size), u32(size),
    Buffer.from([8, 6, 0, 0, 0]) // RGBA
  ])

  const radius = Math.round(size * 0.195)
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(size * 4 + 1)
    row[0] = 0 // filter type None
    for (let x = 0; x < size; x++) {
      // Calcul arrondi par coin
      let alpha = 255
      const dx = Math.max(radius - x, 0, x - (size - 1 - radius))
      const dy = Math.max(radius - y, 0, y - (size - 1 - radius))
      if (dx * dx + dy * dy > radius * radius) alpha = 0

      const i = 1 + x * 4
      // "D" blanc centré — simplifié : juste la couleur de fond violette
      row[i]     = r
      row[i + 1] = g
      row[i + 2] = b
      row[i + 3] = alpha
    }
    rows.push(row)
  }

  const raw = Buffer.concat(rows)
  const compressed = deflateSync(raw)

  const idat = chunk('IDAT', compressed)
  const iend = chunk('IEND', Buffer.alloc(0))
  const ihdrChunk = chunk('IHDR', ihdr2)

  return Buffer.concat([sig, ihdrChunk, idat, iend])
}

// Violet Depanno : #6941C6 = rgb(105, 65, 198)
for (const size of [192, 512]) {
  const png = makePNG(size, 105, 65, 198)
  writeFileSync(`public/icon-${size}.png`, png)
  console.log(`✓ public/icon-${size}.png créé`)
}

// OG image simple (1200x630)
const og = makePNG(630, 105, 65, 198)
writeFileSync('public/og-image.png', og)
console.log('✓ public/og-image.png créé')
