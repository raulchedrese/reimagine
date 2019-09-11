import { number } from "prop-types";

const constrainPosition = (x: number, min: number) =>
  Math.max(Math.min(x, 0), min);

type Rect = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

export default class CommonImageWindow {
  private ctx: CanvasRenderingContext2D | null;
  private imageNaturalSize: Rect;
  private imageSize: Rect;
  private containerSize: Rect;
  private imagePosition: Point;
  private isPanning: boolean;
  private isScaling: boolean;
  private panStart: Point;
  private scaleStart: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  private imagePositionStart: Point;
  private onScale: ((scale: number) => void) | null;
  private image: HTMLImageElement;
  constructor(
    size: { width: number; height: number },
    canvas: HTMLCanvasElement,
    imageSource: string,
    initialDimensions: {
      left: number;
      top: number;
      scaledHeight: number;
      scaledWidth: number;
    } | null,
    imageLoadedCB: () => void
  ) {
    this.ctx = canvas.getContext("2d");
    // Image state
    this.imageNaturalSize = {
      width: 0,
      height: 0
    };
    this.imageSize = { width: 0, height: 0 };
    this.imagePosition = { x: 0, y: 0 };
    this.containerSize = size;

    // Window state
    this.isPanning = false;
    this.isScaling = false;
    this.panStart = { x: 0, y: 0 };
    this.scaleStart = { width: 0, height: 0, x: 0, y: 0 };
    // The position of the image when a pan was started
    this.imagePositionStart = { x: 0, y: 0 };
    this.onScale = null;

    this.image = new Image();
    this.image.src = imageSource;

    this.image.onload = () => {
      this.imageNaturalSize = {
        width: this.image.naturalWidth,
        height: this.image.naturalHeight
      };
      const aspectRatio = this.image.naturalWidth / this.image.naturalHeight;
      if (this.image.naturalWidth >= this.image.naturalHeight) {
        this.imageSize = {
          width: size.width * aspectRatio,
          height: size.height
        };
      } else {
        this.imageSize = {
          width: size.width,
          height: size.width / aspectRatio
        };
      }
      if (initialDimensions) {
        this.imageSize = {
          width: initialDimensions.scaledWidth,
          height: initialDimensions.scaledHeight
        };
        this.imagePosition = {
          x: initialDimensions.left,
          y: initialDimensions.top
        };
      }

      imageLoadedCB();
      this.draw();
    };
  }

  handleScale(callback: (scale: number) => void) {
    this.onScale = callback;
  }

  startPan(x: number, y: number) {
    this.isPanning = true;
    this.panStart = {
      x: x,
      y: y
    };
    this.imagePositionStart = {
      x: this.imagePosition.x,
      y: this.imagePosition.y
    };
  }

  endPan() {
    this.isPanning = false;
  }

  pan(x: number, y: number) {
    if (!this.isPanning) {
      return;
    }

    this.imagePosition = {
      x: constrainPosition(
        this.imagePositionStart.x + (x - this.panStart.x),
        this.containerSize.width - this.imageSize.width
      ),
      y: constrainPosition(
        this.imagePositionStart.y + (y - this.panStart.y),
        this.containerSize.height - this.imageSize.height
      )
    };

    this.draw();
  }

  startScale() {
    this.isScaling = true;
    this.scaleStart = {
      x: this.imagePosition.x,
      y: this.imagePosition.y,
      width: this.imageSize.width,
      height: this.imageSize.height
    };
  }

  stopScale() {
    this.isScaling = false;
  }
  // factor: percentage as decimal
  scale(factor: number) {
    if (factor < this.getMinScale()) {
      return false;
    }

    const newWidth = this.image.naturalWidth * factor;
    const newHeight = this.image.naturalHeight * factor;

    this.imageSize = {
      width: newWidth,
      height: newHeight
    };

    // The ratio of the new width compared to the starting width
    const scaledFactorX = newWidth / this.scaleStart.width;
    const scaledFactorY = newHeight / this.scaleStart.height;
    this.imagePosition = {
      x: constrainPosition(
        (this.scaleStart.x - this.containerSize.width / 2) * scaledFactorX +
          this.containerSize.width / 2,
        this.containerSize.width - this.imageSize.width
      ),
      y: constrainPosition(
        (this.scaleStart.y - this.containerSize.height / 2) * scaledFactorY +
          this.containerSize.height / 2,
        this.containerSize.height - this.imageSize.height
      )
    };

    this.draw();
    if (this.onScale !== null) {
      this.onScale(factor);
    }
    return false;
  }

  getMinScale() {
    return Math.max(
      this.containerSize.width / this.imageNaturalSize.width,
      this.containerSize.height / this.imageNaturalSize.height
    );
  }

  getImageSize() {
    return {
      left: this.imagePosition.x,
      top: this.imagePosition.y,
      width: this.containerSize.width,
      height: this.containerSize.height,
      scaledWidth: this.imageSize.width,
      scaledHeight: this.imageSize.height
    };
  }

  draw() {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(
      0,
      0,
      this.containerSize.width,
      this.containerSize.height
    );
    this.ctx.drawImage(
      this.image,
      this.imagePosition.x,
      this.imagePosition.y,
      this.imageSize.width,
      this.imageSize.height
    );
  }
}
