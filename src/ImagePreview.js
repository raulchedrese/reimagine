import React from "react";
import EditIcon from "./EditIcon";

export default function ImagePreview({ imageSource, imageDimensions }) {
  console.log(imageDimensions);
  return (
    <div>
      <button className="action-button">
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
