import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import CanvasImageWindow from "./CanvasImageWindow";
import ImagePreview from "./ImagePreview";

type ImageDimensions = {
  scale: number;
  left: number;
  top: number;
  scaledHeight: number;
  scaledWidth: number;
}

const createFileURL = (file: File) => window.URL.createObjectURL(file);

type ReimagineProps = {
  width: number;
  height: number;
  onSelectImage: (file: File) => void,
  onEdit: (dimensions: ImageDimensions) => void
};
export default function Reimagine({
  width,
  height,
  onSelectImage,
  onEdit
}: ReimagineProps) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);

  if (!isEditing && imageSource !== null && imageDimensions !== null) {
    return (
      <ImagePreview
        imageSource={imageSource}
        width={width}
        height={height}
        imageDimensions={imageDimensions}
        startEditing={() => setIsEditing(true)}
      />
    );
  }

  if (imageSource === null) {
    return (
      <div>
        <ImageUploader
          setImageSource={(source: File) => {
            setImageSource(createFileURL(source))
            onSelectImage(source)
          }}
          width={width}
          height={height}
        />
      </div>
    );
  }
  return (
    <div>
      <CanvasImageWindow
        width={width}
        height={height}
        imageSource={imageSource}
        clearImage={() => {
          setImageSource(null);
          setImageDimensions(null);
        }}
        setIsEditing={setIsEditing}
        setImageDimensions={(dimensions: ImageDimensions) => {
          setImageDimensions(dimensions)
          onEdit(dimensions)
        }}
        initialDimensions={imageDimensions}
      />
    </div>
  );
}
