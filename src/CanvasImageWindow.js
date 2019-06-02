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
  const [imageManager, setImageManager] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const newManager = new CommonImageWindow(
      imageEl.current,
      imageSource,
      () => {
        setImageLoaded(true);
      }
    );
    newManager.handleScale(newScale => {
      setScale(newScale * 100);
    });
    setImageManager(newManager);
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
        value={scale}
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
          setImageDimensions(imageManager.getImageSize());
          setIsEditing(false);
        }}
      >
        <SaveIcon />
      </button>
    </div>
  );
}
