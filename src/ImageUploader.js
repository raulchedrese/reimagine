import React, { useRef, useState } from "react";

const createFileURL = file => window.URL.createObjectURL(file);

export default function ImageUploader({ setImageSource }) {
  const fileInput = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageChange = () =>
    setImageSource(createFileURL(fileInput.current.files[0]));

  let classes = "drop-area";
  if (isHovering) {
    classes += " drop-area--hovering";
  }
  return (
    <div>
      <div
        className={classes}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          setImageSource(createFileURL(e.dataTransfer.files[0]));
        }}
        onDragEnter={e => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(true);
        }}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(false);
        }}
      >
        <label htmlFor="uploadInput">Drop an image or click</label>
        <input
          id="uploadInput"
          ref={fileInput}
          onChange={handleImageChange}
          type="file"
        />
      </div>
    </div>
  );
}
