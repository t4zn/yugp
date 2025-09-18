declare module '@splinetool/runtime' {
  export class Application {
    constructor(canvas: HTMLCanvasElement);
    load(url: string): Promise<void>;
    dispose(): void;
    // Mouse interaction properties and methods (may not be available in all versions)
    mouseInteraction?: boolean;
    enableMouse?: boolean;
    interactionEnabled?: boolean;
    enableMouseInteraction?(): void;
    setMouseInteraction?(enabled: boolean): void;
  }
}
