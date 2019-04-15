import React, { useState, useRef } from "react";
import "./main.css";

const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";
export default function ImageWindow({ imageSource }) {
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
    const scale = e.target.value / 100;

    setScale(scale);
  };

  let imageWidth = 0;
  let imageHeight = 0;

  if (imageEl.current) {
    const minScale = Math.max(
      200 / imageEl.current.naturalWidth,
      200 / imageEl.current.naturalHeight
    );
    console.log(minScale);
    imageWidth =
      scale > minScale
        ? imageEl.current.naturalWidth * scale
        : imageEl.current.naturalWidth * minScale;
    imageHeight =
      scale > minScale
        ? imageEl.current.naturalHeight * scale
        : imageEl.current.naturalHeight * minScale;
  }
  return (
    <div>
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
            offsetX: windowEl.current.scrollLeft,
            offsetY: windowEl.current.scrollTop
          });
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        onMouseMove={event => {
          if (!isPanning) {
            return;
          }
          event.preventDefault();
          windowEl.current.scrollLeft =
            panningPosition.offsetX + (panningPosition.x - event.clientX);
          windowEl.current.scrollTop =
            panningPosition.offsetY + (panningPosition.y - event.clientY);
        }}
      >
        <img
          ref={imageEl}
          src={imageSource}
          draggable="false"
          className="editable-image"
          style={{
            width: imageWidth,
            height: imageHeight
          }}
        />
      </div>
      <input type="range" onChange={handleSizeChange} />
    </div>
  );
}
