import React from "react";
import EditIcon from "./EditIcon";

export default function ImagePreview({
  imageSource,
  imageDimensions,
  startEditing
}) {
  console.log(imageDimensions);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "208px"
      }}
    >
      <button className="action-button" onClick={() => startEditing()}>
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
