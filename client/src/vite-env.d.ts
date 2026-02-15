/// <reference types="vite/client" />

// SVG imports
declare module '*.svg' {
  const content: string
  export default content
}
