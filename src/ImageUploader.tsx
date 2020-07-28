import React, { useRef, useState } from "react";

type ImageUploaderProps = {
  setImageSource: any;
  width: number;
  height: number;
};
export default function ImageUploader({
  setImageSource,
  width,
  height,
}: ImageUploaderProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = () => {
    if (!fileInput.current || !fileInput.current.files) {
      return;
    }
    setImage(fileInput.current.files[0]);
  };

  const setImage = (imageFile: File) => {
    if (validateFormat(imageFile.type)) {
      setImageSource(imageFile);
    } else {
      setError("Unsupported file type. Use JPEG or PNG.");
      setTimeout(() => {
        setError("");
        setIsHovering(false);
      }, 3000);
    }
  };

  let classes = "drop-area";
  if (isHovering) {
    classes += " drop-area--hovering";
  }
  if (error) {
    classes += " drop-area--error";
  }
  return (
    <div>
      <div
        className={classes}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setImage(e.dataTransfer.files[0]);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovering(false);
        }}
      >
        {error ? (
          <div>{error}</div>
        ) : (
          <label className="uploader__label" htmlFor="uploadInput">
            Drop an image or click
          </label>
        )}
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

const validateFormat = (file: string) =>
  ["image/jpeg", "image/png"].includes(file);
