import React, { useState, useRef } from "react";
import DeleteIcon from "./DeleteIcon";
import SaveIcon from "./SaveIcon";
import "./main.css";

const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";

const scaleImage = ([width, height], scaleFactor, minScale) => {
  if (scaleFactor < minScale) {
    return [width * minScale, height * minScale];
  }

  return [width * scaleFactor, height * scaleFactor];
};

const translateImage = ([x, y], [x0, y0]) => [x + x0, y + y0];

const getMinScale = (naturalWidth, naturalHeight) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

export default function CSSImageWindow({
  imageSource,
  clearImage,
  setIsEditing,
  setImageDimensions
}) {
  const imageEl = useRef(null);
  const windowEl = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [isPanning, setIsPanning] = useState(false);
  const [panningPosition, setPanningPosition] = useState({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0
  });

  const handleSizeChange = e => {
    const scaleFactor = e.target.value / 100;
    setScale(scaleFactor);
  };

  let imageSize = [];
  let minScale = 0;

  if (imageEl.current) {
    minScale = getMinScale(
      imageEl.current.naturalWidth,
      imageEl.current.naturalHeight
    );
    imageSize = scaleImage(
      [imageEl.current.naturalWidth, imageEl.current.naturalHeight],
      scale,
      minScale
    );
  }
  console.log("X: " + panningPosition.offsetX);
  console.log("Y: " + panningPosition.offsetY);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "208px"
      }}
    >
      <div
        ref={windowEl}
        className="image-window"
        style={{
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`
        }}
        onMouseDown={event => {
          setIsPanning(true);
          setPanningPosition({
            x: event.clientX,
            y: event.clientY,
            offsetX: event.clientX,
            offsetY: event.clientY
          });
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        onMouseMove={event => {
          if (!isPanning) {
            return;
          }
          event.preventDefault();
          //   const translatedImage = translateImage(
          //     [panningPosition.offsetX, panningPosition.offsetY],
          //     [
          //       panningPosition.x - event.clientX,
          //       panningPosition.y - event.clientY
          //     ]
          //   );
          setPanningPosition(
            Object.assign({}, panningPosition, {
              offsetX: event.clientX,
              offsetY: event.clientY
            })
          );
          //   windowEl.current.scrollLeft = translatedImage[0];
          //   windowEl.current.scrollTop = translatedImage[1];
        }}
      >
        <img
          ref={imageEl}
          src={imageSource}
          draggable="false"
          className="editable-image"
          style={{
            transform: `scale(${scale}) translate(${
              panningPosition.offsetX
            }px, ${panningPosition.offsetY}px)`
          }}
        />
      </div>
      <input
        className="scale-slider"
        type="range"
        min={minScale * 100}
        onChange={handleSizeChange}
      />
      <button
        className="action-button"
        style={{ left: 0 }}
        onClick={() => clearImage()}
      >
        <DeleteIcon />
      </button>
      <button
        className="action-button"
        style={{ right: 0 }}
        onClick={() => {
          setImageDimensions({
            left: windowEl.current.scrollLeft,
            top: windowEl.current.scrollTop,
            scale: scale
          });
          setIsEditing(false);
        }}
      >
        <SaveIcon />
      </button>
    </div>
  );
}
