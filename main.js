(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.main = factory(global.React));
}(this, function (React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  var createFileURL = function (file) { return window.URL.createObjectURL(file); };
  var sendData = function (file) {
      var formData = new FormData();
      formData.append("image_upload[image]", file);
      fetch("http://localhost:3001/image_uploads", {
          body: formData,
          method: "post"
      });
  };
  function ImageUploader(_a) {
      var setImageSource = _a.setImageSource;
      var fileInput = React.useRef(null);
      var _b = React.useState(false), isHovering = _b[0], setIsHovering = _b[1];
      var handleImageChange = function () {
          if (!fileInput.current || !fileInput.current.files) {
              return;
          }
          sendData(fileInput.current.files[0]);
          setImageSource(createFileURL(fileInput.current.files[0]));
      };
      var classes = "drop-area";
      if (isHovering) {
          classes += " drop-area--hovering";
      }
      return (React__default.createElement("div", null,
          React__default.createElement("div", { className: classes, onDrop: function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageSource(createFileURL(e.dataTransfer.files[0]));
              }, onDragEnter: function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHovering(true);
              }, onDragOver: function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHovering(true);
              }, onDragLeave: function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHovering(false);
              } },
              React__default.createElement("label", { htmlFor: "uploadInput" }, "Drop an image or click"),
              React__default.createElement("input", { id: "uploadInput", ref: fileInput, onChange: handleImageChange, type: "file" }))));
  }

  var CONTAINER_WIDTH = 200;
  var CONTAINER_HEIGHT = 200;
  var getMinScale = function (naturalWidth, naturalHeight) {
      return Math.max(CONTAINER_WIDTH / naturalWidth, CONTAINER_HEIGHT / naturalHeight);
  };
  var constrainPosition = function (x, min) {
      return Math.max(Math.min(x, 0), min);
  };
  var CommonImageWindow = /** @class */ (function () {
      function CommonImageWindow(canvas, imageSource, initialDimensions, imageLoadedCB) {
          var _this = this;
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
          this.image.onload = function () {
              _this.imageNaturalSize = {
                  width: _this.image.naturalWidth,
                  height: _this.image.naturalHeight
              };
              var aspectRatio = _this.image.naturalWidth / _this.image.naturalHeight;
              if (_this.image.naturalWidth >= _this.image.naturalHeight) {
                  _this.imageSize = {
                      width: CONTAINER_HEIGHT * aspectRatio,
                      height: CONTAINER_HEIGHT
                  };
              }
              else {
                  _this.imageSize = {
                      width: CONTAINER_WIDTH,
                      height: CONTAINER_WIDTH / aspectRatio
                  };
              }
              if (initialDimensions) {
                  _this.imageSize = {
                      width: initialDimensions.scaledWidth,
                      height: initialDimensions.scaledHeight
                  };
                  _this.imagePosition = {
                      x: initialDimensions.left,
                      y: initialDimensions.top
                  };
              }
              imageLoadedCB();
              _this.draw();
          };
      }
      CommonImageWindow.prototype.handleScale = function (callback) {
          this.onScale = callback;
      };
      CommonImageWindow.prototype.startPan = function (event) {
          this.isPanning = true;
          this.panStart = {
              x: event.clientX,
              y: event.clientY
          };
          this.imagePositionStart = {
              x: this.imagePosition.x,
              y: this.imagePosition.y
          };
      };
      CommonImageWindow.prototype.endPan = function () {
          this.isPanning = false;
      };
      CommonImageWindow.prototype.pan = function (event) {
          if (!this.isPanning) {
              return;
          }
          this.imagePosition = {
              x: constrainPosition(this.imagePositionStart.x + (event.clientX - this.panStart.x), CONTAINER_WIDTH - this.imageSize.width),
              y: constrainPosition(this.imagePositionStart.y + (event.clientY - this.panStart.y), CONTAINER_HEIGHT - this.imageSize.height)
          };
          this.draw();
      };
      CommonImageWindow.prototype.startScale = function () {
          this.isScaling = true;
          this.scaleStart = {
              x: this.imagePosition.x,
              y: this.imagePosition.y,
              width: this.imageSize.width,
              height: this.imageSize.height
          };
      };
      CommonImageWindow.prototype.stopScale = function () {
          this.isScaling = false;
      };
      // factor: percentage as decimal
      CommonImageWindow.prototype.scale = function (factor) {
          if (factor < getMinScale(this.image.naturalWidth, this.image.naturalHeight)) {
              return false;
          }
          var newWidth = this.image.naturalWidth * factor;
          var newHeight = this.image.naturalHeight * factor;
          this.imageSize = {
              width: newWidth,
              height: newHeight
          };
          // The ratio of the new width compared to the starting width
          var scaledFactorX = newWidth / this.scaleStart.width;
          var scaledFactorY = newHeight / this.scaleStart.height;
          this.imagePosition = {
              x: constrainPosition((this.scaleStart.x - CONTAINER_WIDTH / 2) * scaledFactorX +
                  CONTAINER_WIDTH / 2, CONTAINER_WIDTH - this.imageSize.width),
              y: constrainPosition((this.scaleStart.y - CONTAINER_HEIGHT / 2) * scaledFactorY +
                  CONTAINER_HEIGHT / 2, CONTAINER_HEIGHT - this.imageSize.height)
          };
          this.draw();
          if (this.onScale !== null) {
              this.onScale(factor);
          }
          return false;
      };
      CommonImageWindow.prototype.getMinScale = function () {
          return getMinScale(this.imageNaturalSize.width, this.imageNaturalSize.height);
      };
      CommonImageWindow.prototype.getImageSize = function () {
          return {
              left: this.imagePosition.x,
              top: this.imagePosition.y,
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              scaledWidth: this.imageSize.width,
              scaledHeight: this.imageSize.height
          };
      };
      CommonImageWindow.prototype.draw = function () {
          if (!this.ctx) {
              return;
          }
          this.ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
          this.ctx.drawImage(this.image, this.imagePosition.x, this.imagePosition.y, this.imageSize.width, this.imageSize.height);
      };
      return CommonImageWindow;
  }());

  function DeleteIcon() {
      return (React__default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "100%" },
          React__default.createElement("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }),
          React__default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));
  }

  function SaveIcon() {
      return (React__default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "100%" },
          React__default.createElement("path", { fill: "none", d: "M0 0h24v24H0z" }),
          React__default.createElement("path", { d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" })));
  }

  var CONTAINER_WIDTH$1 = 200;
  var CONTAINER_HEIGHT$1 = 200;
  function CanvasImageWindow(_a) {
      var imageSource = _a.imageSource, clearImage = _a.clearImage, setIsEditing = _a.setIsEditing, setImageDimensions = _a.setImageDimensions, initialDimensions = _a.initialDimensions;
      var imageEl = React.useRef(null);
      var windowEl = React.useRef(null);
      var _b = React.useState(null), imageManager = _b[0], setImageManager = _b[1];
      var _c = React.useState(false), imageLoaded = _c[0], setImageLoaded = _c[1];
      var _d = React.useState(0), scale = _d[0], setScale = _d[1];
      React.useEffect(function () {
          if (!imageEl.current) {
              return;
          }
          var newManager = new CommonImageWindow(imageEl.current, imageSource, initialDimensions, function () {
              setImageLoaded(true);
          });
          newManager.handleScale(function (newScale) {
              setScale(newScale * 100);
          });
          if (initialDimensions) {
              setScale(initialDimensions.scale);
          }
          setImageManager(newManager);
      }, []);
      return (React__default.createElement("div", { style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "208px"
          } },
          React__default.createElement("div", { ref: windowEl, className: "image-window", style: {
                  width: CONTAINER_WIDTH$1 + "px",
                  height: CONTAINER_HEIGHT$1 + "px"
              }, onMouseDown: function (event) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.startPan(event);
              }, onMouseUp: function (event) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.endPan();
              }, onMouseLeave: function () {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.endPan();
              }, onMouseMove: function (event) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.pan(event);
              } },
              React__default.createElement("canvas", { ref: imageEl, width: CONTAINER_WIDTH$1, height: CONTAINER_HEIGHT$1 }, "Fallback")),
          React__default.createElement("input", { className: "scale-slider", type: "range", min: imageManager ? imageManager.getMinScale() * 100 : 0, max: 100, value: scale, onMouseDown: function (e) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.startScale();
              }, onMouseUp: function (e) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.stopScale();
              }, onChange: function (e) {
                  if (!imageManager) {
                      return;
                  }
                  imageManager.scale(parseFloat(e.target.value) / 100);
              } }),
          React__default.createElement("button", { className: "action-button", style: { left: 0 }, onClick: function () { return clearImage(); } },
              React__default.createElement(DeleteIcon, null)),
          React__default.createElement("button", { className: "action-button", style: { right: 0 }, onClick: function () {
                  if (!imageManager) {
                      return;
                  }
                  setImageDimensions(Object.assign({}, imageManager.getImageSize(), { scale: scale }));
                  setIsEditing(false);
              } },
              React__default.createElement(SaveIcon, null))));
  }

  function DeleteIcon$1() {
      return (React__default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
          React__default.createElement("path", { d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" }),
          React__default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));
  }

  function ImagePreview(_a) {
      var imageSource = _a.imageSource, imageDimensions = _a.imageDimensions, startEditing = _a.startEditing;
      return (React__default.createElement("div", { style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "208px"
          } },
          React__default.createElement("button", { className: "action-button", style: { right: 0 }, onClick: function () { return startEditing(); } },
              React__default.createElement(DeleteIcon$1, null)),
          React__default.createElement("div", { style: {
                  position: "relative",
                  width: "200px",
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "50%",
                  border: "4px solid #d8dee9"
              } },
              React__default.createElement("img", { src: imageSource, draggable: false, style: {
                      position: "absolute",
                      top: imageDimensions.top + "px",
                      left: imageDimensions.left + "px",
                      width: imageDimensions.scaledWidth + "px",
                      height: imageDimensions.scaledHeight + "px"
                  } }))));
  }

  function ImageCrop() {
      var _a = React.useState(null), imageSource = _a[0], setImageSource = _a[1];
      var _b = React.useState(true), isEditing = _b[0], setIsEditing = _b[1];
      var _c = React.useState(null), imageDimensions = _c[0], setImageDimensions = _c[1];
      if (!isEditing && imageSource !== null && imageDimensions !== null) {
          return (React__default.createElement(ImagePreview, { imageSource: imageSource, imageDimensions: imageDimensions, startEditing: function () { return setIsEditing(true); } }));
      }
      if (imageSource === null) {
          return (React__default.createElement("div", null,
              React__default.createElement(ImageUploader, { setImageSource: setImageSource })));
      }
      return (React__default.createElement("div", null,
          React__default.createElement(CanvasImageWindow, { imageSource: imageSource, clearImage: function () { return setImageSource(null); }, setIsEditing: setIsEditing, setImageDimensions: setImageDimensions, initialDimensions: imageDimensions })));
  }

  return ImageCrop;

}));
