import { useState, useRef, useEffect } from "react";
import React from "react";
import CommonImageWindow from "./CommonImageWindow";
import DeleteIcon from "./DeleteIcon";
import SaveIcon from "./SaveIcon";

const CONTAINER_WIDTH = 200;
const CONTAINER_HEIGHT = 200;

const getMinScale = (naturalWidth: number, naturalHeight: number) => {
  return Math.max(
    CONTAINER_WIDTH / naturalWidth,
    CONTAINER_HEIGHT / naturalHeight
  );
};

type CanvasImageWindowProps = {
  imageSource: string;
  clearImage: any;
  setIsEditing: any;
  setImageDimensions: any;
  initialDimensions: {
    scale: number;
    left: number;
    top: number;
    scaledHeight: number;
    scaledWidth: number;
  } | null;
};
export default function CanvasImageWindow({
  imageSource,
  clearImage,
  setIsEditing,
  setImageDimensions,
  initialDimensions
}: CanvasImageWindowProps) {
  const imageEl = useRef<HTMLCanvasElement | any>(null);
  const windowEl = useRef(null);
  const [imageManager, setImageManager] = useState<CommonImageWindow | null>(
    null
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    if (!imageEl.current) {
      return;
    }
    const newManager = new CommonImageWindow(
      imageEl.current,
      imageSource,
      initialDimensions,
      () => {
        setImageLoaded(true);
      }
    );
    newManager.handleScale((newScale: number) => {
      setScale(newScale * 100);
    });
    if (initialDimensions) {
      setScale(initialDimensions.scale);
    }
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
          if (!imageManager) {
            return;
          }
          imageManager.startPan(event);
        }}
        onMouseUp={event => {
          if (!imageManager) {
            return;
          }
          imageManager.endPan();
        }}
        onMouseLeave={() => {
          if (!imageManager) {
            return;
          }
          imageManager.endPan();
        }}
        onMouseMove={event => {
          if (!imageManager) {
            return;
          }
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
        onMouseDown={e => {
          if (!imageManager) {
            return;
          }
          imageManager.startScale();
        }}
        onMouseUp={e => {
          if (!imageManager) {
            return;
          }
          imageManager.stopScale();
        }}
        onChange={e => {
          if (!imageManager) {
            return;
          }
          imageManager.scale(parseFloat(e.target.value) / 100);
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
          if (!imageManager) {
            return;
          }
          setImageDimensions(
            Object.assign({}, imageManager.getImageSize(), { scale: scale })
          );
          setIsEditing(false);
        }}
      >
        <SaveIcon />
      </button>
    </div>
  );
}
