import { accessSync } from "fs"
import { resolve, join } from "path"

// This template is standalone: vite may live in the app's own node_modules
// (apps/desktop-full/node_modules) rather than a monorepo root. Accept either.
const appRoot = resolve(import.meta.dirname, "..")
const repoRoot = resolve(import.meta.dirname, "..", "..", "..")

const candidates = [
  join(appRoot, "node_modules", "vite", "package.json"),
  join(repoRoot, "node_modules", "vite", "package.json"),
]

const found = candidates.some((p) => {
  try { accessSync(p); return true } catch { return false }
})

if (!found) {
  console.error(`vite not found. Run: cd ${appRoot} && npm install`)
  process.exit(1)
}
