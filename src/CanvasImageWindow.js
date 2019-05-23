import React, { useState, useRef, useEffect } from "react";
import CommonImageWindow from "./CommonImageWindow";
import DeleteIcon from "./DeleteIcon";
import SaveIcon from "./SaveIcon";
import "./main.css";

const CONTAINER_WIDTH = "200";
const CONTAINER_HEIGHT = "200";

const getMinScale = (naturalWidth, naturalHeight) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

export default function CanvasImageWindow({
  imageSource,
  clearImage,
  setIsEditing,
  setImageDimensions
}) {
  const imageEl = useRef(null);
  const windowEl = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [image, setImage] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageManager, setImageManager] = useState(null);

  useEffect(() => {
    setImageManager(new CommonImageWindow(imageEl.current, imageSource));
  }, []);
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
          imageManager.startPan(event);
        }}
        onMouseUp={event => {
          imageManager.endPan();
        }}
        onMouseLeave={() => {
          imageManager.endPan();
        }}
        onMouseMove={event => {
          imageManager.pan(event);
        }}
      >
        <canvas ref={imageEl} width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT}>
          Fallback
        </canvas>
      </div>
      <input
        className="scale-slider"
        type="range"
        min={imageManager ? imageManager.getMinScale() * 100 : 0}
        max={100}
        onChange={e => {
          imageManager.scale(e.target.value / 100);
        }}
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
