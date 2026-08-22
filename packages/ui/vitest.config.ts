import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { statSync } from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(import.meta.dirname, 'src')

/**
 * `@/` inside this package means THIS package's src — same rule the app's Vite
 * config applies per importer, and the same rule packages/ui/tsconfig.json
 * encodes in its `paths`. Declared here so the test runner agrees with both.
 *
 * Resolves to FILES only: `existsSync` happily returns true for a directory
 * named `i18n`, and handing a folder to the bundler fails with EACCES.
 */
const resolveAt = (source: string): string | null => {
  const target = path.join(SRC, source.slice(2))

  for (const candidate of [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.css`,
    path.join(target, 'index.ts'),
    path.join(target, 'index.tsx')
  ]) {
    try {
      if (statSync(candidate).isFile()) {
        return candidate
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null
}

export default defineConfig({
  plugins: [
    {
      name: 'boilerplate:at-alias',
      enforce: 'pre',
      resolveId: (source: string) => (source.startsWith('@/') ? resolveAt(source) : null)
    },
    react()
  ],
  css: {
    // See apps/shell/vite.config.ts — an empty pin keeps postcss-load-config
    // from walking up the filesystem into a stray Tailwind v3 config.
    postcss: { plugins: [] }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}']
  }
})
