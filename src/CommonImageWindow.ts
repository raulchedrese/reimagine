const CONTAINER_WIDTH = 200;
const CONTAINER_HEIGHT = 200;

const getMinScale = (naturalWidth: number, naturalHeight: number) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

const constrainPosition = (x: number, min: number) =>
  Math.max(Math.min(x, 0), min);

export default class CommonImageWindow {
  private ctx: CanvasRenderingContext2D | null;
  private imageNaturalSize: {
    width: number;
    height: number;
  };
  private imageSize: {
    width: number;
    height: number;
  };
  private imagePosition: {
    x: number;
    y: number;
  };
  private isPanning: boolean;
  private isScaling: boolean;
  private panStart: {
    x: number;
    y: number;
  };
  private scaleStart: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  private imagePositionStart: {
    x: number;
    y: number;
  };
  private onScale: ((scale: number) => void) | null;
  private image: HTMLImageElement;
  constructor(
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
          width: CONTAINER_HEIGHT * aspectRatio,
          height: CONTAINER_HEIGHT
        };
      } else {
        this.imageSize = {
          width: CONTAINER_WIDTH,
          height: CONTAINER_WIDTH / aspectRatio
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

  startPan(event: React.MouseEvent) {
    this.isPanning = true;
    this.panStart = {
      x: event.clientX,
      y: event.clientY
    };
    this.imagePositionStart = {
      x: this.imagePosition.x,
      y: this.imagePosition.y
    };
  }

  endPan() {
    this.isPanning = false;
  }

  pan(event: React.MouseEvent) {
    if (!this.isPanning) {
      return;
    }

    this.imagePosition = {
      x: constrainPosition(
        this.imagePositionStart.x + (event.clientX - this.panStart.x),
        CONTAINER_WIDTH - this.imageSize.width
      ),
      y: constrainPosition(
        this.imagePositionStart.y + (event.clientY - this.panStart.y),
        CONTAINER_HEIGHT - this.imageSize.height
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
    if (
      factor < getMinScale(this.image.naturalWidth, this.image.naturalHeight)
    ) {
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
        (this.scaleStart.x - CONTAINER_WIDTH / 2) * scaledFactorX +
          CONTAINER_WIDTH / 2,
        CONTAINER_WIDTH - this.imageSize.width
      ),
      y: constrainPosition(
        (this.scaleStart.y - CONTAINER_HEIGHT / 2) * scaledFactorY +
          CONTAINER_HEIGHT / 2,
        CONTAINER_HEIGHT - this.imageSize.height
      )
    };

    this.draw();
    if (this.onScale !== null) {
      this.onScale(factor);
    }
    return false;
  }

  getMinScale() {
    return getMinScale(
      this.imageNaturalSize.width,
      this.imageNaturalSize.height
    );
  }

  getImageSize() {
    return {
      left: this.imagePosition.x,
      top: this.imagePosition.y,
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      scaledWidth: this.imageSize.width,
      scaledHeight: this.imageSize.height
    };
  }

  draw() {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
    this.ctx.drawImage(
      this.image,
      this.imagePosition.x,
      this.imagePosition.y,
      this.imageSize.width,
      this.imageSize.height
    );
  }
}
