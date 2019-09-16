export default class CommonImageWindow {
    private ctx;
    private imageNaturalSize;
    private imageSize;
    private containerSize;
    private imagePosition;
    private isPanning;
    private isScaling;
    private panStart;
    private scaleStart;
    private imagePositionStart;
    private onScale;
    private image;
    constructor(size: {
        width: number;
        height: number;
    }, canvas: HTMLCanvasElement, imageSource: string, initialDimensions: {
        left: number;
        top: number;
        scaledHeight: number;
        scaledWidth: number;
    } | null, imageLoadedCB: () => void);
    handleScale(callback: (scale: number) => void): void;
    startPan(x: number, y: number): void;
    endPan(): void;
    pan(x: number, y: number): void;
    startScale(): void;
    stopScale(): void;
    scale(factor: number): boolean;
    getMinScale(): number;
    getImageSize(): {
        left: number;
        top: number;
        width: number;
        height: number;
        scaledWidth: number;
        scaledHeight: number;
    };
    draw(): void;
}
