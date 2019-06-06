const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";

const getMinScale = (naturalWidth, naturalHeight) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

const centerToOffset = (center, width, height) => ({
  x: center.x - CONTAINER_WIDTH / 2,
  y: center.y - CONTAINER_HEIGHT / 2
});

const offsetToCenter = (left, top) => ({
  x: left + CONTAINER_WIDTH / 2,
  y: top + CONTAINER_HEIGHT / 2
});

// const offetToCenter = (x, y)

export default class CommonImageWindow {
  constructor(canvas, imageSource, imageLoadedCB) {
    this.imageSize = { width: 0, height: 0 };
    this.imageNaturalSize = {
      width: 0,
      height: 0
    };
    this.imagePosition = { x: 0, y: 0 };
    this.imageCenter = { x: 0, y: 0 };
    this.ctx = canvas.getContext("2d");
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
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
      this.imageCenter = { x: CONTAINER_WIDTH / 2, y: CONTAINER_HEIGHT / 2 };
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
      x: Math.max(
        Math.min(
          this.imagePositionStart.x + (event.clientX - this.panStart.x),
          0
        ),
        CONTAINER_WIDTH - this.imageSize.width
      ),
      y: Math.max(
        Math.min(
          this.imagePositionStart.y + (event.clientY - this.panStart.y),
          0
        ),
        CONTAINER_HEIGHT - this.imageSize.height
      )
    };
    this.imageCenter = { x: event.clientX, y: event.clientY };

    this.draw();
  }

  // factor: percentage as decimal
  scale(factor) {
    if (
      factor < getMinScale(this.image.naturalWidth, this.image.naturalHeight)
    ) {
      return false;
    }
    console.log(this.imagePosition);
    // The position of the center of the image before we scale it.
    const preScaleImageCenter = offsetToCenter(
      this.imagePosition.x,
      this.imagePosition.y
    );
    console.log(preScaleImageCenter);
    this.imageSize = {
      width: this.image.naturalWidth * factor,
      height: this.image.naturalHeight * factor
    };
    const centerAdjustedPosition = centerToOffset(
      preScaleImageCenter,
      this.imageSize.width,
      this.imageSize.height
    );
    console.log(centerAdjustedPosition);
    this.imagePosition = {
      x: centerAdjustedPosition.x,
      y: centerAdjustedPosition.y
    };
    // this.imagePosition = { x: , y: }
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
