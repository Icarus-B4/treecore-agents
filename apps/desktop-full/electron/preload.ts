import { contextBridge, ipcRenderer, webUtils } from 'electron'

contextBridge.exposeInMainWorld('hermesDesktop', {
  getConnection: profile => ipcRenderer.invoke('treecore:connection', profile),
  revalidateConnection: () => ipcRenderer.invoke('treecore:connection:revalidate'),
  touchBackend: profile => ipcRenderer.invoke('treecore:backend:touch', profile),
  getGatewayWsUrl: profile => ipcRenderer.invoke('treecore:gateway:ws-url', profile),
  openSessionWindow: (sessionId, opts) => ipcRenderer.invoke('treecore:window:openSession', sessionId, opts),
  openWindow: () => ipcRenderer.invoke('treecore:window:openInstance'),
  claimAmbientCue: key => ipcRenderer.invoke('treecore:ambient:claim', key),
  wakeIndicator: {
    getState: () => ipcRenderer.invoke('treecore:wake-indicator:get'),
    setState: state => ipcRenderer.send('treecore:wake-indicator:set', state),
    onState: callback => {
      const listener = (_event, state) => callback(state)
      ipcRenderer.on('treecore:wake-indicator:state', listener)

      return () => ipcRenderer.removeListener('treecore:wake-indicator:state', listener)
    }
  },
  petOverlay: {
    // Main renderer → main process: window lifecycle + drag. `request` is
    // `{ bounds, screen }`; resolves with the screen bounds it actually used.
    open: request => ipcRenderer.invoke('treecore:pet-overlay:open', request),
    close: () => ipcRenderer.invoke('treecore:pet-overlay:close'),
    setBounds: bounds => ipcRenderer.send('treecore:pet-overlay:set-bounds', bounds),
    setIgnoreMouse: ignore => ipcRenderer.send('treecore:pet-overlay:ignore-mouse', ignore),
    // Flip the overlay focusable (and focus it) while the composer needs keys.
    setFocusable: focusable => ipcRenderer.send('treecore:pet-overlay:set-focusable', focusable),
    // Main renderer → overlay (forwarded by main): push the latest pet state.
    pushState: payload => ipcRenderer.send('treecore:pet-overlay:state', payload),
    // Overlay → main renderer (forwarded by main): pop back in / composer submit.
    control: payload => ipcRenderer.send('treecore:pet-overlay:control', payload),
    // Overlay subscribes to state pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:pet-overlay:state', listener)

      return () => ipcRenderer.removeListener('treecore:pet-overlay:state', listener)
    },
    // Main renderer subscribes to overlay control messages.
    onControl: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:pet-overlay:control', listener)

      return () => ipcRenderer.removeListener('treecore:pet-overlay:control', listener)
    }
  },
  // Quick Entry: the global-hotkey mini composer window. Main owns the OS
  // shortcut + the persisted preference; the quick window only captures text
  // and hands it back, and the primary renderer submits it through the normal
  // prompt path.
  quickEntry: {
    getSettings: () => ipcRenderer.invoke('treecore:quick-entry:settings:get'),
    setSettings: patch => ipcRenderer.invoke('treecore:quick-entry:settings:set', patch),
    submit: payload => ipcRenderer.send('treecore:quick-entry:submit', payload),
    dismiss: () => ipcRenderer.send('treecore:quick-entry:dismiss'),
    // Primary renderer → main → quick window: gateway connection state + the
    // recent-session options the target picker offers. Main caches the latest
    // payload so a freshly spawned quick window starts from truth.
    pushState: payload => ipcRenderer.send('treecore:quick-entry:state', payload),
    // Quick window subscribes to those pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:quick-entry:state', listener)

      return () => ipcRenderer.removeListener('treecore:quick-entry:state', listener)
    },
    // Main → primary renderer: a submit captured by the quick window.
    onSubmit: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:quick-entry:submit', listener)

      return () => ipcRenderer.removeListener('treecore:quick-entry:submit', listener)
    },
    // Main → quick window: you were just summoned (reset draft + refocus).
    onShown: callback => {
      const listener = () => callback()
      ipcRenderer.on('treecore:quick-entry:shown', listener)

      return () => ipcRenderer.removeListener('treecore:quick-entry:shown', listener)
    }
  },
  getBootProgress: () => ipcRenderer.invoke('treecore:boot-progress:get'),
  getConnectionConfig: profile => ipcRenderer.invoke('treecore:connection-config:get', profile),
  saveConnectionConfig: payload => ipcRenderer.invoke('treecore:connection-config:save', payload),
  applyConnectionConfig: payload => ipcRenderer.invoke('treecore:connection-config:apply', payload),
  testConnectionConfig: payload => ipcRenderer.invoke('treecore:connection-config:test', payload),
  sshConfigHosts: () => ipcRenderer.invoke('treecore:ssh-config:hosts'),
  sshResolveHost: host => ipcRenderer.invoke('treecore:ssh-config:resolve', host),
  probeConnectionConfig: remoteUrl => ipcRenderer.invoke('treecore:connection-config:probe', remoteUrl),
  oauthLoginConnectionConfig: remoteUrl => ipcRenderer.invoke('treecore:connection-config:oauth-login', remoteUrl),
  oauthLogoutConnectionConfig: remoteUrl => ipcRenderer.invoke('treecore:connection-config:oauth-logout', remoteUrl),
  // Hermes Cloud: one portal login powers discovery + silent per-agent sign-in
  // (cloud-auto-discovery Phase 3).
  cloud: {
    status: () => ipcRenderer.invoke('treecore:cloud:status'),
    login: () => ipcRenderer.invoke('treecore:cloud:login'),
    logout: () => ipcRenderer.invoke('treecore:cloud:logout'),
    discover: org => ipcRenderer.invoke('treecore:cloud:discover', org),
    agentSignIn: dashboardUrl => ipcRenderer.invoke('treecore:cloud:agent-sign-in', dashboardUrl)
  },
  profile: {
    get: () => ipcRenderer.invoke('treecore:profile:get'),
    set: name => ipcRenderer.invoke('treecore:profile:set', name)
  },
  api: request => ipcRenderer.invoke('treecore:api', request),
  notify: payload => ipcRenderer.invoke('treecore:notify', payload),
  requestMicrophoneAccess: () => ipcRenderer.invoke('treecore:requestMicrophoneAccess'),
  readFileDataUrl: filePath => ipcRenderer.invoke('treecore:readFileDataUrl', filePath),
  readFileDataUrlForAttach: filePath => ipcRenderer.invoke('treecore:readFileDataUrlForAttach', filePath),
  dataUrlReadMax: {
    get: () => ipcRenderer.invoke('treecore:data-url-read-max:get'),
    set: maxMb => ipcRenderer.invoke('treecore:data-url-read-max:set', maxMb)
  },
  readFileText: filePath => ipcRenderer.invoke('treecore:readFileText', filePath),
  selectPaths: options => ipcRenderer.invoke('treecore:selectPaths', options),
  selectSavePath: options => ipcRenderer.invoke('treecore:selectSavePath', options),
  writeClipboard: text => ipcRenderer.invoke('treecore:writeClipboard', text),
  readClipboard: () => ipcRenderer.invoke('treecore:readClipboard'),
  saveImageFromUrl: url => ipcRenderer.invoke('treecore:saveImageFromUrl', url),
  saveImageBuffer: (data, ext) => ipcRenderer.invoke('treecore:saveImageBuffer', { data, ext }),
  saveClipboardImage: () => ipcRenderer.invoke('treecore:saveClipboardImage'),
  getPathForFile: file => {
    try {
      return webUtils.getPathForFile(file) || ''
    } catch {
      return ''
    }
  },
  normalizePreviewTarget: (target, baseDir) => ipcRenderer.invoke('treecore:normalizePreviewTarget', target, baseDir),
  watchPreviewFile: url => ipcRenderer.invoke('treecore:watchPreviewFile', url),
  watchDirectory: dir => ipcRenderer.invoke('treecore:watchDirectory', dir),
  stopPreviewFileWatch: id => ipcRenderer.invoke('treecore:stopPreviewFileWatch', id),
  setActiveWork: payload => ipcRenderer.send('treecore:active-work', payload),
  setTitleBarTheme: payload => ipcRenderer.send('treecore:titlebar-theme', payload),
  setNativeTheme: mode => ipcRenderer.send('treecore:native-theme', mode),
  setTranslucency: payload => ipcRenderer.send('treecore:translucency', payload),
  setKeepAwake: on => ipcRenderer.send('treecore:keep-awake', on),
  setPreviewShortcutActive: active => ipcRenderer.send('treecore:previewShortcutActive', Boolean(active)),
  openExternal: url => ipcRenderer.invoke('treecore:openExternal', url),
  openPreviewInBrowser: url => ipcRenderer.invoke('treecore:openPreviewInBrowser', url),
  fetchLinkTitle: url => ipcRenderer.invoke('treecore:fetchLinkTitle', url),
  sanitizeWorkspaceCwd: cwd => ipcRenderer.invoke('treecore:workspace:sanitize', cwd),
  settings: {
    getDefaultProjectDir: () => ipcRenderer.invoke('treecore:setting:defaultProjectDir:get'),
    setDefaultProjectDir: dir => ipcRenderer.invoke('treecore:setting:defaultProjectDir:set', dir),
    pickDefaultProjectDir: () => ipcRenderer.invoke('treecore:setting:defaultProjectDir:pick')
  },
  zoom: {
    // Current zoom of this window, as { level, percent }.
    get: () => ipcRenderer.invoke('treecore:zoom:get'),
    setPercent: percent => ipcRenderer.send('treecore:zoom:set-percent', percent),
    // Fires on every zoom change, including the Ctrl/Cmd +/-/0 shortcuts,
    // so the settings UI can stay in sync with the keyboard.
    onChanged: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:zoom:changed', listener)

      return () => ipcRenderer.removeListener('treecore:zoom:changed', listener)
    }
  },
  revealLogs: () => ipcRenderer.invoke('treecore:logs:reveal'),
  getRecentLogs: () => ipcRenderer.invoke('treecore:logs:recent'),
  readDir: dirPath => ipcRenderer.invoke('treecore:fs:readDir', dirPath),
  gitRoot: startPath => ipcRenderer.invoke('treecore:fs:gitRoot', startPath),
  revealPath: targetPath => ipcRenderer.invoke('treecore:fs:reveal', targetPath),
  openDir: dirPath => ipcRenderer.invoke('treecore:fs:openDir', dirPath),
  desktopPluginsRoot: () => ipcRenderer.invoke('treecore:fs:desktopPluginsRoot'),
  renamePath: (targetPath, newName) => ipcRenderer.invoke('treecore:fs:rename', targetPath, newName),
  writeTextFile: (filePath, content) => ipcRenderer.invoke('treecore:fs:writeText', filePath, content),
  trashPath: targetPath => ipcRenderer.invoke('treecore:fs:trash', targetPath),
  git: {
    worktreeList: repoPath => ipcRenderer.invoke('treecore:git:worktreeList', repoPath),
    worktreeAdd: (repoPath, options) => ipcRenderer.invoke('treecore:git:worktreeAdd', repoPath, options),
    worktreeRemove: (repoPath, worktreePath, options) =>
      ipcRenderer.invoke('treecore:git:worktreeRemove', repoPath, worktreePath, options),
    branchSwitch: (repoPath, branch) => ipcRenderer.invoke('treecore:git:branchSwitch', repoPath, branch),
    branchList: repoPath => ipcRenderer.invoke('treecore:git:branchList', repoPath),
    baseBranchList: repoPath => ipcRenderer.invoke('treecore:git:baseBranchList', repoPath),
    repoStatus: repoPath => ipcRenderer.invoke('treecore:git:repoStatus', repoPath),
    fileDiff: (repoPath, filePath) => ipcRenderer.invoke('treecore:git:fileDiff', repoPath, filePath),
    scanRepos: (roots, options) => ipcRenderer.invoke('treecore:git:scanRepos', roots, options),
    review: {
      list: (repoPath, scope, baseRef) => ipcRenderer.invoke('treecore:git:review:list', repoPath, scope, baseRef),
      diff: (repoPath, filePath, scope, baseRef, staged) =>
        ipcRenderer.invoke('treecore:git:review:diff', repoPath, filePath, scope, baseRef, staged),
      stage: (repoPath, filePath) => ipcRenderer.invoke('treecore:git:review:stage', repoPath, filePath),
      unstage: (repoPath, filePath) => ipcRenderer.invoke('treecore:git:review:unstage', repoPath, filePath),
      revert: (repoPath, filePath) => ipcRenderer.invoke('treecore:git:review:revert', repoPath, filePath),
      revParse: (repoPath, ref) => ipcRenderer.invoke('treecore:git:review:revParse', repoPath, ref),
      commit: (repoPath, message, push) => ipcRenderer.invoke('treecore:git:review:commit', repoPath, message, push),
      commitContext: repoPath => ipcRenderer.invoke('treecore:git:review:commitContext', repoPath),
      push: repoPath => ipcRenderer.invoke('treecore:git:review:push', repoPath),
      shipInfo: repoPath => ipcRenderer.invoke('treecore:git:review:shipInfo', repoPath),
      createPr: repoPath => ipcRenderer.invoke('treecore:git:review:createPr', repoPath)
    }
  },
  terminal: {
    cwd: id => ipcRenderer.invoke('treecore:terminal:cwd', id),
    dispose: id => ipcRenderer.invoke('treecore:terminal:dispose', id),
    resize: (id, size) => ipcRenderer.invoke('treecore:terminal:resize', id, size),
    start: options => ipcRenderer.invoke('treecore:terminal:start', options),
    write: (id, data) => ipcRenderer.invoke('treecore:terminal:write', id, data),
    onData: (id, callback) => {
      const channel = `hermes:terminal:${id}:data`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    },
    onExit: (id, callback) => {
      const channel = `hermes:terminal:${id}:exit`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    }
  },
  onClosePreviewRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('treecore:close-preview-requested', listener)

    return () => ipcRenderer.removeListener('treecore:close-preview-requested', listener)
  },
  onOpenFolderRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('treecore:open-folder-requested', listener)

    return () => ipcRenderer.removeListener('treecore:open-folder-requested', listener)
  },
  onOpenUpdatesRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('treecore:open-updates', listener)

    return () => ipcRenderer.removeListener('treecore:open-updates', listener)
  },
  onDeepLink: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:deep-link', listener)

    return () => ipcRenderer.removeListener('treecore:deep-link', listener)
  },
  signalDeepLinkReady: () => ipcRenderer.invoke('treecore:deep-link-ready'),
  onWindowStateChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:window-state-changed', listener)

    return () => ipcRenderer.removeListener('treecore:window-state-changed', listener)
  },
  onFocusSession: callback => {
    const listener = (_event, sessionId) => callback(sessionId)
    ipcRenderer.on('treecore:focus-session', listener)

    return () => ipcRenderer.removeListener('treecore:focus-session', listener)
  },
  onNotificationAction: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:notification-action', listener)

    return () => ipcRenderer.removeListener('treecore:notification-action', listener)
  },
  onPreviewFileChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:preview-file-changed', listener)

    return () => ipcRenderer.removeListener('treecore:preview-file-changed', listener)
  },
  onBackendExit: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:backend-exit', listener)

    return () => ipcRenderer.removeListener('treecore:backend-exit', listener)
  },
  // Soft gateway-mode apply finished tearing down the primary backend. Renderer
  // should wipe session lists + re-dial without a window reload.
  onConnectionApplied: callback => {
    const listener = () => callback()
    ipcRenderer.on('treecore:connection:applied', listener)

    return () => ipcRenderer.removeListener('treecore:connection:applied', listener)
  },
  onPowerResume: callback => {
    const listener = () => callback()
    ipcRenderer.on('treecore:power-resume', listener)

    return () => ipcRenderer.removeListener('treecore:power-resume', listener)
  },
  // AC ↔ battery transitions; renderers slow their backstop polls on battery.
  getOnBattery: () => ipcRenderer.invoke('treecore:power-battery:get'),
  onBatteryChanged: callback => {
    const listener = (_event, onBattery) => callback(Boolean(onBattery))
    ipcRenderer.on('treecore:power-battery', listener)

    return () => ipcRenderer.removeListener('treecore:power-battery', listener)
  },
  onBootProgress: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:boot-progress', listener)

    return () => ipcRenderer.removeListener('treecore:boot-progress', listener)
  },
  // First-launch bootstrap progress -- emitted by the install.ps1 stage
  // runner in main.ts (apps/desktop/electron/bootstrap-runner.ts).
  // Renderer's install overlay subscribes to live events and queries the
  // current snapshot via getBootstrapState() to recover after a devtools
  // reload mid-bootstrap.
  getBootstrapState: () => ipcRenderer.invoke('treecore:bootstrap:get'),
  continueBootstrapLocal: () => ipcRenderer.invoke('treecore:bootstrap:continue-local'),
  resetBootstrap: () => ipcRenderer.invoke('treecore:bootstrap:reset'),
  repairBootstrap: () => ipcRenderer.invoke('treecore:bootstrap:repair'),
  cancelBootstrap: () => ipcRenderer.invoke('treecore:bootstrap:cancel'),
  onBootstrapEvent: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('treecore:bootstrap:event', listener)

    return () => ipcRenderer.removeListener('treecore:bootstrap:event', listener)
  },
  getVersion: () => ipcRenderer.invoke('treecore:version'),
  getRemoteDisplayReason: () => ipcRenderer.invoke('treecore:get-remote-display-reason'),
  uninstall: {
    summary: () => ipcRenderer.invoke('treecore:uninstall:summary'),
    run: mode => ipcRenderer.invoke('treecore:uninstall:run', { mode })
  },
  updates: {
    check: () => ipcRenderer.invoke('treecore:updates:check'),
    apply: opts => ipcRenderer.invoke('treecore:updates:apply', opts),
    getBranch: () => ipcRenderer.invoke('treecore:updates:branch:get'),
    setBranch: name => ipcRenderer.invoke('treecore:updates:branch:set', name),
    onProgress: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('treecore:updates:progress', listener)

      return () => ipcRenderer.removeListener('treecore:updates:progress', listener)
    }
  },
  themes: {
    fetchMarketplace: id => ipcRenderer.invoke('treecore:vscode-theme:fetch', id),
    searchMarketplace: query => ipcRenderer.invoke('treecore:vscode-theme:search', query)
  },
  // Find-in-page (Ctrl/Cmd+F): delegates to Electron's
  // webContents.findInPage on the IPC sender's window so a Cmd+F pressed
  // in a secondary session window searches THAT window, not the primary.
  // `onFoundInPage` returns the unsubscribe fn; the renderer wires it via
  // `initFindInPageListener` in store/find-in-page.ts and tears it down
  // when the FindBar unmounts.
  findInPage: (query, options) => ipcRenderer.invoke('treecore:find-in-page', query, options),
  stopFindInPage: () => ipcRenderer.invoke('treecore:stop-find-in-page'),
  onFoundInPage: callback => {
    const listener = (_event, result) => callback(result)
    ipcRenderer.on('treecore:found-in-page', listener)

    return () => ipcRenderer.removeListener('treecore:found-in-page', listener)
  }
})
