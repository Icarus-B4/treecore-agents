/**
 * App entry — renders the empty 6-region layout skeleton (1:1 with the
 * Hermes Desktop chrome, no Nous data). See src/layout.tsx.
 *
 * The previous primitive gallery (P1 verification surface) lives in
 * src/gallery.tsx and can be mounted behind a route or a dev flag when you
 * want to eyeball the design system.
 */

import { ShellLayout } from './layout'

export default function App() {
  return <ShellLayout />
}
