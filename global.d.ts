export {}

declare global {
  interface Window {
    Goftino: {
      open: () => void;
      setWidget:({})=>void
    }
  }
}
