declare module '@splinetool/runtime' {
  export class Application {
    constructor(canvas: HTMLCanvasElement);
    load(url: string): Promise<void>;
    dispose(): void;
  }
}
