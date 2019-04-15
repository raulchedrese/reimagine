import React, { useState } from "react";

import ImageUploader from "./ImageUploader";
import ImageWindow from "./ImageWindow";

export default function ImageCrop() {
  const [imageSource, setImageSource] = useState(null);
  return (
    <div>
      {imageSource === null ? (
        <ImageUploader setImageSource={setImageSource} />
      ) : (
        <ImageWindow imageSource={imageSource} />
      )}
    </div>
  );
}
