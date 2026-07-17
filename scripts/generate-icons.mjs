/**
 * Génère icon-192.png et icon-512.png pour la PWA Depanno
 * Usage: node scripts/generate-icons.mjs
 */
import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const r = size * 0.195  // border-radius relatif

  // Background violet arrondi
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fillStyle = '#6941C6'
  ctx.fill()

  // "D" blanc
  ctx.fillStyle = 'white'
  ctx.font = `900 ${Math.round(size * 0.52)}px Arial Black, Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('D', size / 2, size / 2 + size * 0.03)

  return canvas.toBuffer('image/png')
}

const sizes = [192, 512]
for (const size of sizes) {
  const buf = drawIcon(size)
  const dest = join('public', `icon-${size}.png`)
  writeFileSync(dest, buf)
  console.log(`✓ ${dest} généré (${size}×${size})`)
}
