const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";

const getMinScale = (naturalWidth, naturalHeight) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

export default class CommonImageWindow {
  constructor(canvas, imageSource) {
    this.imageSize = { width: 0, height: 0 };
    this.imagePosition = { x: 0, y: 0 };
    this.ctx = canvas.getContext("2d");
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    // The position of the image when a pan was started
    this.imagePositionStart = { x: 0, y: 0 };

    this.image = new Image();
    this.image.src = imageSource;

    this.image.onload = () => {
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
      this.draw();
    };
  }

  startPan(event) {
    this.isPanning = true;
    this.panStart = { x: event.clientX, y: event.clientY };
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
    console.log({
      x: event.clientX,
      y: event.clientY
    });

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

    this.draw();
  }

  // factor: percentage as decimal
  scale(factor) {
    if (
      factor < getMinScale(this.image.naturalWidth, this.image.naturalHeight)
    ) {
      return false;
    }
    console.log("factor: " + factor);
    console.log(getMinScale(this.image.naturalWidth, this.image.naturalHeight));
    this.imageSize = {
      width: this.image.naturalWidth * factor,
      height: this.image.naturalHeight * factor
    };
    this.draw();
  }

  getMinScale() {
    return getMinScale(this.image.naturalWidth, this.image.naturalHeight);
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
