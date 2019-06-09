const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";

const getMinScale = (naturalWidth, naturalHeight) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

const constrainPosition = (x, min) => Math.max(Math.min(x, 0), min);

export default class CommonImageWindow {
  constructor(canvas, imageSource, imageLoadedCB) {
    this.imageSize = { width: 0, height: 0 };
    this.imageNaturalSize = {
      width: 0,
      height: 0
    };
    this.imagePosition = { x: 0, y: 0 };
    this.ctx = canvas.getContext("2d");
    this.isPanning = false;
    this.isScaling = false;
    this.panStart = { x: 0, y: 0 };
    this.scaleStart = { x: 0, y: 0 };
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
      imageLoadedCB();
      this.draw();
    };
  }

  handleScale(callback) {
    this.onScale = callback;
  }

  startPan(event) {
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

  pan(event) {
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
  scale(factor) {
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
      scaledWitdh: this.imageSize.width,
      scaledHeight: this.imageSize.height
    };
  }

  draw() {
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
