// Global ambient declarations for i18n production stabilization

declare global {
  interface Window {
    Chart?: {
      new (ctx: CanvasRenderingContext2D, config: unknown): unknown;
    };
  }
}

export {};
