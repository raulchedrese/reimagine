import React from "react";
import EditIcon from "./EditIcon";

type ImagePreviewProps = {
  imageSource: string;
  width: number;
  height: number;
  imageDimensions: {
    scale: number;
    left: number;
    top: number;
    scaledHeight: number;
    scaledWidth: number;
  };
  startEditing: () => void;
};
export default function ImagePreview({
  imageSource,
  width,
  height,
  imageDimensions,
  startEditing
}: ImagePreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: `${width + 8}px`
      }}
    >
      <button
        className="action-button"
        style={{ right: 0 }}
        onClick={() => startEditing()}
      >
        <EditIcon />
      </button>
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          overflow: "hidden",
          borderRadius: "50%",
          border: "4px solid #d8dee9"
        }}
      >
        <img
          src={imageSource}
          draggable={false}
          style={{
            position: "absolute",
            top: `${imageDimensions.top}px`,
            left: `${imageDimensions.left}px`,
            width: `${imageDimensions.scaledWidth}px`,
            height: `${imageDimensions.scaledHeight}px`
          }}
        />
      </div>
    </div>
  );
}
