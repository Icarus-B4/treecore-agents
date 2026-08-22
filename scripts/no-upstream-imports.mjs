#!/usr/bin/env node
/**
 * Decoupling gate.
 *
 * The upstream design system was measured to have ZERO imports from app/business
 * layers (@/store, @/hermes, @/lib/gateway, @hermes/shared, @/app, @/contrib) —
 * its only seam was i18n, which this template replaces with a local adapter.
 *
 * That property is the whole reason the template can stay generic, and it is
 * easy to lose the first time someone "just needs one store value" inside a
 * primitive. This gate freezes the measured state.
 *
 * Detection is deliberately literal: a violation is a MODULE REFERENCE
 * (import / from / require / url() / @import) naming a forbidden path. Prose in
 * a comment that documents a removal is not a violation — the ports explain
 * what was dropped and why, and that documentation must not trip the gate.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const UI_SRC = resolve(here, '../packages/ui/src')

const FORBIDDEN = [
  '@/store',
  '@/hermes',
  '@/lib/gateway',
  '@hermes/shared',
  '@/app/',
  '@/contrib',
  '@nous-research/ui',
  'window.hermesDesktop'
]

/** Files that exist only for comparison, not as shipped code. */
const IGNORED = new Set(['styles.reference.css'])

const walk = dir => {
  const out = []

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)

    if (statSync(full).isDirectory()) {
      out.push(...walk(full))
    } else if (/\.(ts|tsx|css)$/.test(entry)) {
      out.push(full)
    }
  }

  return out
}

/**
 * Strip comments so only live code is inspected. Handles `//`, `/* *\/` and CSS
 * block comments — the multi-line case matters because a comment body has no
 * per-line marker to key off.
 */
const stripComments = source => {
  let out = ''
  let i = 0
  let state = 'code'

  while (i < source.length) {
    const two = source.slice(i, i + 2)

    if (state === 'code') {
      if (two === '//') {
        state = 'line'
        i += 2
      } else if (two === '/*') {
        state = 'block'
        i += 2
      } else {
        out += source[i]
        i += 1
      }
    } else if (state === 'line') {
      if (source[i] === '\n') {
        out += '\n'
        state = 'code'
      }
      i += 1
    } else {
      if (two === '*/') {
        state = 'code'
        i += 2
      } else {
        // Preserve newlines so reported line numbers stay accurate.
        if (source[i] === '\n') out += '\n'
        i += 1
      }
    }
  }

  return out
}

/** A module reference, not incidental prose. */
const REFERENCE_CUES = ['from', 'import', 'require', 'url(', '@import']

const isModuleReference = (line, pattern) => {
  if (!line.includes(pattern)) {
    return false
  }

  // `window.hermesDesktop` is a runtime global, not a module path — any live
  // occurrence is a violation on its own.
  if (!pattern.startsWith('@')) {
    return true
  }

  return REFERENCE_CUES.some(cue => line.includes(cue))
}

const files = walk(UI_SRC)
const violations = []

for (const file of files) {
  const name = file.split(/[\\/]/).pop()

  if (IGNORED.has(name)) {
    continue
  }

  const lines = stripComments(readFileSync(file, 'utf8')).split('\n')

  lines.forEach((line, i) => {
    for (const pattern of FORBIDDEN) {
      if (isModuleReference(line, pattern)) {
        violations.push(`packages/ui/src/${relative(UI_SRC, file).replace(/\\/g, '/')}:${i + 1}  ${pattern}`)
      }
    }
  })
}

console.log(`no-upstream-imports: scanned ${files.length} files in packages/ui/src`)

if (violations.length) {
  console.error(`\n  x ${violations.length} coupling violation(s):`)
  for (const v of violations) console.error(`    ${v}`)
  console.error('\nThe design system must not depend on app/business layers.')
  process.exit(1)
}

console.log('  ok design system is free of app/business imports')
