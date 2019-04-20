import React from "react";
import EditIcon from "./EditIcon";

export default function ImagePreview({ imageSource, imageDimensions }) {
  return (
    <div>
      <button>
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
            left: `-${imageDimensions.left}px`,
            top: `-${imageDimensions.top}px`,
            transformOrigin: "top left",
            transform: `scale(${imageDimensions.scale})`
          }}
        />
      </div>
    </div>
  );
}
