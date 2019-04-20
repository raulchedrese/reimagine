import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import ImageWindow from "./ImageWindow";

export default function ImageCrop() {
  const [imageSource, setImageSource] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  if (!isEditing && imageSource !== null) {
    return (
      <div>
        <img src={imageSource} />
      </div>
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
      <ImageWindow
        imageSource={imageSource}
        setImageSource={setImageSource}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
