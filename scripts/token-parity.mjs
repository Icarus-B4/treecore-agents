#!/usr/bin/env node
/**
 * Token parity gate.
 *
 * styles.css does not fail loudly. A missing custom property makes a
 * color-mix() chain resolve to `transparent`, so the build stays green and the
 * UI just looks *slightly* wrong — the worst possible failure mode, because
 * eyeballing does not reliably catch it.
 *
 * So: compare the SET OF CUSTOM PROPERTY NAMES declared in the vendored
 * stylesheet against the pristine upstream copy (styles.reference.css).
 * Names only — values are allowed to be rebranded, names are the contract.
 *
 * Exit 1 on any property present upstream but missing here.
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const uiSrc = resolve(here, '../packages/ui/src')

const CURRENT = resolve(uiSrc, 'styles.css')
const REFERENCE = resolve(uiSrc, 'styles.reference.css')

/** Declared custom properties: `--name:` on the left of a colon. */
const declaredProps = css => {
  const names = new Set()

  for (const match of css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) {
    names.add(match[1])
  }

  return names
}

let current
let reference

try {
  current = readFileSync(CURRENT, 'utf8')
  reference = readFileSync(REFERENCE, 'utf8')
} catch (err) {
  console.error(`token-parity: cannot read stylesheets — ${err.message}`)
  process.exit(1)
}

const currentProps = declaredProps(current)
const referenceProps = declaredProps(reference)

const missing = [...referenceProps].filter(p => !currentProps.has(p)).sort()
const added = [...currentProps].filter(p => !referenceProps.has(p)).sort()

console.log(`token-parity: reference ${referenceProps.size} props, current ${currentProps.size} props`)

if (added.length) {
  console.log(`\n  ${added.length} added (fine — template-only additions):`)
  for (const p of added) console.log(`    + ${p}`)
}

if (missing.length) {
  console.error(`\n  ✗ ${missing.length} token(s) LOST vs. reference:`)
  for (const p of missing) console.error(`    - ${p}`)
  console.error('\nA lost token silently degrades to transparent. Restore it or document the removal.')
  process.exit(1)
}

console.log('\n  ✓ no tokens lost')
