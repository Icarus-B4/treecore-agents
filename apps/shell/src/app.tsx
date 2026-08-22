/**
 * Reference shell — the structural frame, reproduced with placeholder content.
 *
 * Its job is to prove two things at once:
 *   1. the token chain paints (backgrounds, hairlines, shadows, radii)
 *   2. a representative spread of the vendored primitives compose without
 *      breaking each other's styling — the real risk when 73 components share
 *      one stylesheet and one token namespace.
 *
 * It is NOT meant to be exhaustive (that is what the Vitest suite covers). When
 * you add a primitive, render it here too so a visual regression is catchable
 * without running the full test runner.
 */

import { useState } from 'react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Checkbox,
  Codicon,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Kbd,
  Progress,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tip,
  useTheme
} from '@boilerplate/ui'

function ThemeControls() {
  const { availableThemes, mode, renderedMode, setMode, setTheme, themeName } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableThemes.map(theme => (
        <Button key={theme.name} variant={themeName === theme.name ? 'default' : 'outline'} size="sm" onClick={() => setTheme(theme.name)}>
          {theme.label}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      {(['light', 'dark', 'system'] as const).map(m => (
        <Button key={m} variant={mode === m ? 'default' : 'ghost'} size="sm" onClick={() => setMode(m)}>
          {m}
        </Button>
      ))}
      <Badge className="ml-auto" variant="muted">
        painted: {renderedMode}
      </Badge>
    </div>
  )
}

function PrimitivesGallery() {
  const [checked, setChecked] = useState(true)
  const [switchOn, setSwitchOn] = useState(false)
  const [progress, setProgress] = useState(40)
  const [tab, setTab] = useState('a')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2 text-(--ui-text-secondary) text-sm font-medium">Buttons &amp; badges</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button>default</Button>
          <Button variant="secondary">secondary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="destructive">destructive</Button>
          <Button variant="link">link</Button>
          <Badge>badge</Badge>
          <Badge variant="muted">muted</Badge>
          <Codicon name="settings-gear" className="text-(--ui-text-secondary)" />
          <Kbd>⌘K</Kbd>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-2 text-(--ui-text-secondary) text-sm font-medium">Form controls</h3>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={checked} onCheckedChange={v => setChecked(Boolean(v))} /> checkbox
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} /> switch
          </label>
          <Input placeholder="Type…" className="w-48" />
          <Select value="x" onValueChange={() => {}}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">Option X</SelectItem>
              <SelectItem value="y">Option Y</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-2 text-(--ui-text-secondary) text-sm font-medium">Feedback &amp; overlays</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Progress value={progress} className="w-48" />
          <Tip label="Tooltip from the seam">
            <Button variant="outline" size="sm">
              hover me
            </Button>
          </Tip>
          <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
            open confirm
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            open dialog
          </Button>
          <Button variant="outline" size="sm" onClick={() => setProgress(p => Math.min(100, p + 10))}>
            +10%
          </Button>
          <Skeleton className="h-6 w-24" />
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-2 text-(--ui-text-secondary) text-sm font-medium">Tabs &amp; command</h3>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="a">One</TabsTrigger>
            <TabsTrigger value="b">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="pt-2 text-sm">
            First panel — Tabs share the token namespace with everything above.
          </TabsContent>
          <TabsContent value="b" className="pt-2 text-sm">
            Second panel.
          </TabsContent>
        </Tabs>
        <div className="mt-3">
          <Command>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem onSelect={() => {}}>New file</CommandItem>
                <CommandItem onSelect={() => {}}>Open settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-2 text-(--ui-text-secondary) text-sm font-medium">Scroll area &amp; alert</h3>
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>This is an alert rendered from the design system.</AlertDescription>
        </Alert>
        <ScrollArea className="mt-2 h-24 w-64 rounded-md border border-(--stroke-nous)">
          <div className="space-y-2 p-3 text-sm">
            {Array.from({ length: 12 }).map((_, i) => (
              <p key={i} className="text-(--ui-text-secondary)">
                Scrollable line {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Confirm action"
        description="This is a confirmation dialog from the vendored primitive."
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>A dialog rendered from the design system.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Say something…" className="mt-3" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-(--ui-text-primary)">
      <div className="mx-auto max-w-3xl space-y-6 p-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Boilerplate</h1>
          <p className="text-(--ui-text-secondary)">design system reference</p>
        </header>
        <ThemeControls />
        <PrimitivesGallery />
      </div>
    </div>
  )
}
