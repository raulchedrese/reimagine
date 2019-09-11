import React, { useRef, useState } from "react";

type ImageUploaderProps = {
  setImageSource: any;
  width: number;
  height: number;
};
export default function ImageUploader({
  setImageSource,
  width,
  height
}: ImageUploaderProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageChange = () => {
    if (!fileInput.current || !fileInput.current.files) {
      return;
    }
    setImageSource(fileInput.current.files[0]);
  };

  let classes = "drop-area";
  if (isHovering) {
    classes += " drop-area--hovering";
  }
  return (
    <div>
      <div
        className={classes}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          setImageSource(e.dataTransfer.files[0]);
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
