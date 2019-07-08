import React from "react";
import EditIcon from "./EditIcon";

type ImagePreviewProps = {
  imageSource: string;
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
  imageDimensions,
  startEditing
}: ImagePreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "208px"
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
          width: "200px",
          height: "200px",
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
