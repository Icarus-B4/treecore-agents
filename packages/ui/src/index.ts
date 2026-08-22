/** Public surface of the design system. */

export { Badge, badgeVariants } from './components/ui/badge'
export { Button, buttonVariants } from './components/ui/button'
export { Codicon } from './components/ui/codicon'
export { controlVariants } from './components/ui/control'
export type { ControlVariantProps } from './components/ui/control'
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from './components/ui/dialog'
export { Input } from './components/ui/input'
export { Kbd, KbdCombo, KbdGroup, kbdVariants } from './components/ui/kbd'
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './components/ui/popover'
export { Separator } from './components/ui/separator'
export { Skeleton } from './components/ui/skeleton'

export { en, I18nProvider, makeTranslations, translateNow, useI18n } from './i18n'
export type { CommonStrings, I18nContextValue, Translations } from './i18n'

export { cn } from './lib/utils'

export * from './theme'
