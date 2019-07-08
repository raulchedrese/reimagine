import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import CanvasImageWindow from "./CanvasImageWindow";
import ImagePreview from "./ImagePreview";
import EditIcon from "./EditIcon";

export default function ImageCrop() {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<{
    scale: number;
    left: number;
    top: number;
    scaledHeight: number;
    scaledWidth: number;
  } | null>(null);

  if (!isEditing && imageSource !== null && imageDimensions !== null) {
    return (
      <ImagePreview
        imageSource={imageSource}
        imageDimensions={imageDimensions}
        startEditing={() => setIsEditing(true)}
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
        initialDimensions={imageDimensions}
      />
    </div>
  );
}
