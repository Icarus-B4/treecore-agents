import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { statSync } from 'node:fs'
import path from 'node:path'

// Hermes Setup — Tauri-targeted Vite config.
//
// Relies on packages/ui for the design system. Two alias classes matter:
//   1. `@boilerplate/ui` → packages/ui/src (JS/TS barrel) — also used by the
//      shell app, so the same shape is declared there.
//   2. `@boilerplate/ui/styles.css` → packages/ui/src/styles.css. CSS @import
//      does NOT go through the JS alias map the way Vite's resolver does for
//      `import` statements; feeding it the directory resolves to the folder and
//      Tailwind fails. The plugin below maps the exact specifier to the file.

const UI_SRC = path.resolve(__dirname, '../packages/ui/src')
const UI_BARREL = path.join(UI_SRC, 'index.ts')
const UI_STYLES = path.join(UI_SRC, 'styles.css')

const resolveAt = (source: string): string | null => {
  if (source === '@boilerplate/ui') return UI_BARREL
  if (source === '@boilerplate/ui/styles.css') return UI_STYLES

  const target = path.join(UI_SRC, source.slice('@boilerplate/ui/'.length))
  for (const candidate of [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.css`,
    path.join(target, 'index.ts'),
    path.join(target, 'index.tsx')
  ]) {
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {
      // try next
    }
  }
  return null
}

export default defineConfig({
  plugins: [
    {
      name: 'boilerplate:ui-alias',
      enforce: 'pre',
      resolveId: (source: string) =>
        source.startsWith('@boilerplate/ui') ? resolveAt(source) : null
    },
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // PITFALL: empty postcss pin. Without it, postcss-load-config walks UP the
  // filesystem and any stray Tailwind v3 config reprocesses this v4 sheet.
  css: {
    postcss: { plugins: [] }
  },
  clearScreen: false,
  server: {
    port: 5175,
    strictPort: true,
    host: process.env.TAURI_DEV_HOST || '127.0.0.1'
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true
  }
})
