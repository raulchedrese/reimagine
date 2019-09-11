import React, { useState } from "react";
import ReactDOM from "react-dom";
import Reimagine from "./index";

type ImageDimensions = {
  scale: number;
  left: number;
  top: number;
  scaledHeight: number;
  scaledWidth: number;
}

const saveImageEdit = (imageId: string, dimensions: ImageDimensions) => {
  console.log(JSON.stringify(dimensions))
  fetch(`https://apipond.com/image_uploads/${imageId}`, {
    method: 'put',
    body: JSON.stringify(dimensions)
  }).then(response => {
    return response.json()
  })
}

const uploadImage = (file: File) => {
  let formData = new FormData();
  formData.append("image_upload[image]", file);

  return fetch("https://apipond.com/image_uploads", {
    body: formData,
    method: "post"
  })
    .then(response => response.json())
    .then(json => json.upload_id);
};

export default function DemoComponent() {
  const [imageId, setImageId] = useState(null);
  return <div>
    <Reimagine
      width={200}
      height={200}
      onSelectImage={(file) => uploadImage(file).then(id => {
        setImageId(id);
      })}
      onEdit={saveImageEdit.bind(null, imageId)}
    />
  </div>
}
ReactDOM.render(
  <DemoComponent />,
  document.getElementById("root")
);
