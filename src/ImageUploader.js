import React, { useRef } from "react";

export default function ImageUploader({ setImageSource }) {
  const fileInput = useRef(null);

  const handleImageChange = () => {
    const selectedFile = fileInput.current.files[0];
    const imageSource = window.URL.createObjectURL(selectedFile);
    const image = new Image();
    image.src = imageSource;
    console.log(image.width);
    setImageSource(imageSource);
  };
  return (
    <div>
      <div>Upload Image</div>
      <input ref={fileInput} onChange={handleImageChange} type="file" />
    </div>
  );
}
