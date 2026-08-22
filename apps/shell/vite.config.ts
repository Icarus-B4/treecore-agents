import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { statSync } from 'node:fs'
import path from 'node:path'

const ROOT = import.meta.dirname
const UI_SRC = path.resolve(ROOT, '../../packages/ui/src')
const APP_SRC = path.resolve(ROOT, './src')

/**
 * Importer-aware `@/` resolution.
 *
 * The design system's own files import via `@/...` and mean THEIR package root;
 * this app uses `@/...` for its own src. A single alias cannot serve both, and
 * rewriting the vendored primitives to relative paths would break the one rule
 * that keeps this template maintainable: primitives are copied VERBATIM, so
 * re-syncing with upstream is a file copy rather than a merge.
 *
 * So resolve by importer, exactly the way the two tsconfigs already do with
 * their separate `paths` maps. tsc and the bundler then agree.
 */
const scopedAliasPlugin = (): Plugin => ({
  name: 'boilerplate:scoped-at-alias',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!source.startsWith('@/')) {
      return null
    }

    const base = importer && path.resolve(importer).startsWith(UI_SRC) ? UI_SRC : APP_SRC
    const target = path.join(base, source.slice(2))

    // Bare specifiers carry no extension; probe the real ones.
    //
    // statSync-isFile, not existsSync: a directory named `i18n` satisfies
    // existsSync, so returning it hands the bundler a folder to read as a
    // module and the build dies with EACCES ("Zugriff verweigert"). The
    // directory itself must only ever resolve via its index file.
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
        // Not present — try the next candidate.
      }
    }

    return null
  }
})

/*
 * PITFALL — the `postcss: { plugins: [] }` pin below is NOT optional.
 *
 * Tailwind v4 is driven entirely by @tailwindcss/vite, so this app needs no
 * PostCSS plugins. Without an explicit config, Vite's postcss-load-config walks
 * UP the filesystem hunting for postcss.config.* / tailwind.config.*. A stray
 * Tailwind v3 config anywhere above the project root then reprocesses the v4
 * stylesheet and the build dies with:
 *
 *   "`@layer base` is used but no matching `@tailwind base` directive is present"
 *
 * Pinning an empty config makes the build hermetic. Carried over from
 * apps/desktop/vite.config.ts, where it was learned the hard way.
 */
export default defineConfig({
  base: './',
  plugins: [scopedAliasPlugin(), react(), tailwindcss()],
  css: {
    postcss: { plugins: [] }
  },
  resolve: {
    alias: {
      '@boilerplate/ui': path.resolve(UI_SRC, 'index.ts'),
      '@boilerplate/ui/styles.css': path.resolve(UI_SRC, 'styles.css')
    },
    dedupe: ['react', 'react-dom']
  }
})
