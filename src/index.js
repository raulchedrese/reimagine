import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import CanvasImageWindow from "./CanvasImageWindow";
import ImagePreview from "./ImagePreview";
import EditIcon from "./EditIcon";

export default function ImageCrop() {
  const [imageSource, setImageSource] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    scaledWitdh: 200,
    scaledHeight: 200
  });

  if (!isEditing && imageSource !== null) {
    return (
      <ImagePreview
        imageSource={imageSource}
        imageDimensions={imageDimensions}
      />
    );
  }

  if (imageSource === null) {
    return (
      <div>
        <ImageUploader setImageSource={setImageSource} />
      </div>
    );
  }

  return (
    <div>
      <CanvasImageWindow
        imageSource={imageSource}
        clearImage={() => setImageSource(null)}
        setIsEditing={setIsEditing}
        setImageDimensions={setImageDimensions}
      />
    </div>
  );
}
