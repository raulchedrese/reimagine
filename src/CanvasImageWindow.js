import React, { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    const ctx = imageEl.current.getContext("2d");
    const image = new Image();
    image.src = imageSource;

    image.onload = () => {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      console.log(aspectRatio);
      let initialSize = null;
      if (image.naturalWidth >= image.naturalHeight) {
        initialSize = {
          width: CONTAINER_HEIGHT * aspectRatio,
          height: CONTAINER_HEIGHT
        };
      } else {
        initialSize = {
          width: CONTAINER_WIDTH,
          height: CONTAINER_WIDTH / aspectRatio
        };
      }
      console.log(initialSize);
      ctx.drawImage(image, 0, 0, initialSize.width, initialSize.height);
      setImageSize(initialSize);
    };
    setImage(image);
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
          setIsPanning(true);
          setDragStart({ x: event.clientX, y: event.clientY });
        }}
        onMouseUp={event => {
          setIsPanning(false);
          const rect = imageEl.current.getBoundingClientRect();
          setImagePosition({
            x: imagePosition.x + (event.clientX - dragStart.x),
            y: imagePosition.y + (event.clientY - dragStart.y)
          });
        }}
        onMouseLeave={() => {
          setIsPanning(false);
          const rect = imageEl.current.getBoundingClientRect();
          setImagePosition({
            x: imagePosition.x + (event.clientX - dragStart.x),
            y: imagePosition.y + (event.clientY - dragStart.y)
          });
        }}
        onMouseMove={event => {
          if (!isPanning) {
            return;
          }
          console.log({
            x: event.clientX,
            y: event.clientY
          });
          const ctx = imageEl.current.getContext("2d");
          const rect = imageEl.current.getBoundingClientRect();
          ctx.clearRect(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
          ctx.drawImage(
            image,
            imagePosition.x + (event.clientX - dragStart.x),
            imagePosition.y + (event.clientY - dragStart.y),
            imageSize.width,
            imageSize.height
          );
        }}
      >
        <canvas ref={imageEl} width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT}>
          Fallback
        </canvas>
      </div>
      <input
        className="scale-slider"
        type="range"
        min={0}
        onChange={() => {}}
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
