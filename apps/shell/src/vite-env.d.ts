/// <reference types="vite/client" />

// Side-effect CSS imports (`import './styles.css'`) need a module declaration
// under TS's stricter module resolution, otherwise TS2882.
declare module '*.css' {}
