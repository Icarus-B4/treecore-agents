/**
 * Empty 6-region layout skeleton — visually 1:1 with the Hermes Desktop
 * chrome, carrying NO Nous data.
 *
 * Regions (top → bottom, left → right):
 *   1. TitleBar      — logo, workspace tabs, window utilities
 *   2. LeftSidebar   — nav tabs + placeholder list + status cluster
 *   3. CenterPane    — main work area + floating prompt input
 *   4. RightPane     — placeholder file-explorer rail
 *   5. TerminalDock  — bottom panel with a placeholder terminal
 *   6. StatusBar     — footer with static status pills
 *
 * Every region uses the same design-system tokens the original titlebar.ts
 * hard-codes (--titlebar-height, --ui-chat-surface-background,
 * --ui-stroke-tertiary, …), so the chrome matches pixel-for-pixel. The
 * CONTENTS are placeholders: no sessions, no gateway, no agents.
 */

import { useState } from 'react'

import { Button, Codicon, cn } from '@boilerplate/ui'

const TITLEBAR_CLASS =
  'pointer-events-none relative z-3 flex h-(--titlebar-height) w-full min-w-0 shrink-0 items-center justify-start gap-3 overflow-hidden border-b border-(--ui-stroke-tertiary) bg-(--ui-chat-surface-background) pl-[0.75rem] pr-[calc(0.75rem+0.75rem)]'

/* ------------------------------------------------------------------ */
/* 1. Title bar                                                        */
/* ------------------------------------------------------------------ */

const WORKSPACE_TABS = ['SESSIONS', 'BOTS', 'DEVELOP — EXAMPLE', 'NEW SESSION'] as const

function TitleBar() {
  const [activeTab, setActiveTab] = useState<string>(WORKSPACE_TABS[0])

  return (
    <header className={TITLEBAR_CLASS}>
      <div className="pointer-events-auto flex min-w-0 flex-1 items-center gap-3">
        {/* Logo slot */}
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-(--ui-accent) text-[0.7rem] font-bold text-(--ui-accent-foreground)">
          H
        </div>

        {/* Workspace tabs */}
        <nav className="flex min-w-0 items-center gap-1">
          {WORKSPACE_TABS.map(tab => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'whitespace-nowrap border-b-2 px-2 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-(--ui-accent) text-foreground'
                    : 'border-transparent text-(--ui-text-tertiary) hover:text-foreground'
                )}
              >
                {tab}
              </button>
            )
          })}
          <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="New tab">
            <Codicon name="add" size="14" />
          </Button>
        </nav>
      </div>

      {/* Window utilities (visual only) */}
      <div className="pointer-events-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Layout">
          <Codicon name="layout" size="14" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Notifications">
          <Codicon name="bell" size="14" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Settings">
          <Codicon name="gear" size="14" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Profile">
          <Codicon name="account" size="14" />
        </Button>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Left sidebar                                                     */
/* ------------------------------------------------------------------ */

const NAV_TABS = [
  'Sessions',
  'Capabilities',
  'Messaging',
  'Artifacts',
  'Scheduled jobs',
  'Kanban'
] as const

const PLACEHOLDER_SESSIONS = [
  'Example session one',
  'Example session two',
  'Example session three',
  'Example session four',
  'Example session five'
]

function LeftSidebar() {
  const [activeNav, setActiveNav] = useState<string>(NAV_TABS[0])

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-(--ui-stroke-tertiary) bg-(--ui-sidebar-surface-background)">
      {/* Nav tabs */}
      <nav className="flex flex-col gap-0.5 p-2">
        {NAV_TABS.map(tab => {
          const active = tab === activeNav
          return (
            <button
              key={tab}
              onClick={() => setActiveNav(tab)}
              className={cn(
                'flex items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                active
                  ? 'bg-(--ui-control-hover-background) text-foreground'
                  : 'text-(--ui-text-tertiary) hover:bg-(--ui-control-hover-background) hover:text-foreground'
              )}
            >
              {tab}
            </button>
          )
        })}
        <input
          type="text"
          placeholder="Search sessions…"
          className="mt-2 w-full rounded-md border border-(--ui-stroke-tertiary) bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-(--ui-text-tertiary) focus:outline-none"
        />
      </nav>

      {/* Pinned section */}
      <div className="px-2 pb-1 pt-3">
        <div className="px-2 text-[0.7rem] font-semibold uppercase tracking-wide text-(--ui-text-quaternary)">
          Pinned
        </div>
        <ul className="mt-1 space-y-0.5">
          {PLACEHOLDER_SESSIONS.slice(0, 2).map(s => (
            <li
              key={s}
              className="truncate rounded-md px-2 py-1.5 text-sm text-(--ui-text-tertiary)"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Sessions list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-1">
        <div className="px-2 text-[0.7rem] font-semibold uppercase tracking-wide text-(--ui-text-quaternary)">
          Sessions
        </div>
        <ul className="mt-1 space-y-0.5">
          {PLACEHOLDER_SESSIONS.map(s => (
            <li
              key={s}
              className="truncate rounded-md px-2 py-1.5 text-sm text-(--ui-text-tertiary)"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Status cluster */}
      <div className="flex items-center gap-3 border-t border-(--ui-stroke-tertiary) px-3 py-2 text-[0.7rem] text-(--ui-text-quaternary)">
        <span>Gateway ready</span>
        <span>user</span>
        <span>Agents</span>
        <span>Cron</span>
        <span>Webhooks</span>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Center pane                                                      */
/* ------------------------------------------------------------------ */

function CenterPane() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-(--ui-chat-surface-background)">
      {/* Empty work area */}
      <div className="flex flex-1 items-center justify-center text-sm text-(--ui-text-tertiary)">
        Empty work area — your app content goes here
      </div>

      {/* Floating prompt input */}
      <div className="p-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-xl border border-(--ui-stroke-tertiary) bg-(--ui-sidebar-surface-background) px-3 py-2">
          <Codicon name="add" size="16" className="text-(--ui-text-tertiary)" />
          <input
            type="text"
            placeholder="Keep it going…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-(--ui-text-tertiary) focus:outline-none"
          />
        </div>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Right pane (placeholder file rail)                               */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_FILES = [
  'src',
  'components',
  'lib',
  'public',
  'package.json',
  'tsconfig.json',
  'README.md'
]

function RightPane() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-l border-(--ui-stroke-tertiary) bg-(--ui-sidebar-surface-background) md:flex">
      <div className="flex items-center justify-between border-b border-(--ui-stroke-tertiary) px-3 py-2 text-sm font-medium text-foreground">
        EXPLORER
        <Button variant="ghost" size="icon" className="h-5 w-5" aria-label="Close">
          <Codicon name="close" size="12" />
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 text-sm text-(--ui-text-tertiary)">
        {PLACEHOLDER_FILES.map(f => (
          <li key={f} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-(--ui-control-hover-background)">
            <Codicon name="file" size="14" />
            {f}
          </li>
        ))}
      </ul>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Terminal dock                                                    */
/* ------------------------------------------------------------------ */

function TerminalDock() {
  return (
    <section className="h-40 shrink-0 border-t border-(--ui-stroke-tertiary) bg-(--ui-chat-surface-background)">
      <div className="flex items-center gap-2 border-b border-(--ui-stroke-tertiary) px-3 py-1.5 text-xs font-medium text-(--ui-text-tertiary)">
        <Codicon name="terminal" size="14" />
        TERMINAL
      </div>
      <div className="p-3 font-mono text-xs text-(--ui-text-tertiary)">$ _</div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Status bar                                                       */
/* ------------------------------------------------------------------ */

function StatusBar() {
  return (
    <footer className="flex h-5 shrink-0 items-center justify-between gap-2 bg-(--ui-sidebar-surface-background) px-2 text-[0.6875rem] text-(--ui-text-tertiary)">
      <div className="flex items-center gap-3">
        <span>Gateway ready</span>
        <span>user</span>
        <span>Agents</span>
        <span>Cron</span>
        <span>Webhooks</span>
      </div>
      <div className="flex items-center gap-3">
        <span>#template</span>
        <span>Off</span>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Layout assembly                                                     */
/* ------------------------------------------------------------------ */

export function ShellLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <LeftSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <CenterPane />
            <RightPane />
          </div>
          <TerminalDock />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}
