/**
 * Reference shell — the structural frame, reproduced with placeholder content.
 *
 * Its job is to prove two things at once:
 *   1. the token chain paints (backgrounds, hairlines, shadows, radii)
 *   2. the `data-*` attribute contract is intact — styles.css keys many rules
 *      off attributes like [data-pane-shell] / [data-slot] / [data-ref], so an
 *      app that omits them silently loses styling with a green build.
 */

import { useState } from 'react'

import { Badge, Button, Input, Kbd, Separator, Skeleton, useTheme } from '@boilerplate/ui'

function ThemeControls() {
  const { availableThemes, mode, renderedMode, setMode, setTheme, themeName } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableThemes.map(theme => (
        <Button
          key={theme.name}
          onClick={() => setTheme(theme.name)}
          size="xs"
          variant={theme.name === themeName ? 'default' : 'secondary'}
        >
          {theme.label}
        </Button>
      ))}
      <Separator className="mx-1 h-4" orientation="vertical" />
      {(['light', 'dark', 'system'] as const).map(m => (
        <Button key={m} onClick={() => setMode(m)} size="xs" variant={m === mode ? 'default' : 'ghost'}>
          {m}
        </Button>
      ))}
      <Badge variant="muted">painted: {renderedMode}</Badge>
    </div>
  )
}

export default function App() {
  const [value, setValue] = useState('')

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-background text-foreground"
      data-pane-shell
    >
      {/* Titlebar */}
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-(--ui-stroke-tertiary) px-3">
        <span className="text-xs font-semibold">Boilerplate</span>
        <span className="text-(--ui-text-tertiary) text-xs">design system reference</span>
        <div className="ml-auto flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          className="flex w-56 shrink-0 flex-col gap-1 border-r border-(--ui-stroke-tertiary) bg-(--ui-bg-chrome) p-2"
          data-pane-side="left"
        >
          <div className="text-(--ui-text-tertiary) px-2 py-1 text-[0.6875rem] font-medium tracking-wide uppercase">
            Sections
          </div>
          {['Overview', 'Primitives', 'Tokens', 'Layout'].map((item, i) => (
            <button
              className="row-hover flex items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-xs"
              key={item}
              type="button"
            >
              <span className="text-(--ui-text-secondary)">{item}</span>
              {i === 0 && (
                <Badge className="ml-auto" variant="muted">
                  3
                </Badge>
              )}
            </button>
          ))}
          <div className="mt-auto flex flex-col gap-1.5 px-1">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-2/3" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col overflow-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
            <section className="flex flex-col gap-3">
              <h1 className="text-lg font-semibold">Theme</h1>
              <p className="text-(--ui-text-secondary) text-xs">
                Skin controls accent, mode controls brightness. They persist independently.
              </p>
              <ThemeControls />
            </section>

            <Separator />

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Button variants</h2>
              <div className="flex flex-wrap items-center gap-2">
                {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'text', 'textStrong'] as const).map(
                  variant => (
                    <Button key={variant} variant={variant}>
                      {variant}
                    </Button>
                  )
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['xs', 'sm', 'default', 'lg'] as const).map(size => (
                  <Button key={size} size={size} variant="secondary">
                    {size}
                  </Button>
                ))}
              </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Input</h2>
              <Input onChange={e => setValue(e.target.value)} placeholder="Type…" value={value} />
            </section>

            <Separator />

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Elevation</h2>
              <div className="rounded-lg border-(--stroke-nous) bg-card p-4 shadow-nous">
                <div className="text-xs font-medium">shadow-nous + --stroke-nous</div>
                <p className="text-(--ui-text-secondary) mt-1 text-xs">
                  The borderless-overlay treatment: one token pair, tuned in styles.css.
                </p>
              </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Reference chips</h2>
              <p className="text-xs">
                Attribute-driven accents:{' '}
                <span data-ref="file">src/main.tsx</span>, <span data-ref="url">example.com</span>,{' '}
                <span data-ref="command">npm run build</span>, <span data-ref="git">main</span>
              </p>
            </section>
          </div>
        </main>
      </div>

      {/* Statusbar */}
      <footer className="text-(--ui-text-tertiary) flex h-6 shrink-0 items-center gap-3 border-t border-(--ui-stroke-tertiary) px-3 text-[0.6875rem]">
        <span>ready</span>
        <span className="ml-auto">@boilerplate/ui</span>
      </footer>
    </div>
  )
}
