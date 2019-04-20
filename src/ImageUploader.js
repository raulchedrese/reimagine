import React, { useRef, useState } from "react";

export default function ImageUploader({ setImageSource }) {
  const fileInput = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageChange = () => {
    const selectedFile = fileInput.current.files[0];
    const imageSource = window.URL.createObjectURL(selectedFile);
    const image = new Image();
    image.src = imageSource;
    setImageSource(imageSource);
  };

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
          let dt = e.dataTransfer;
          let files = dt.files;
          const imageSource = window.URL.createObjectURL(files[0]);
          const image = new Image();
          image.src = imageSource;
          setImageSource(imageSource);
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
