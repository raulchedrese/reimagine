/// <reference types="react" />
declare type ImageDimensions = {
    scale: number;
    left: number;
    top: number;
    scaledHeight: number;
    scaledWidth: number;
};
declare type ReimagineProps = {
    width: number;
    height: number;
    onSelectImage: (file: File) => void;
    onEdit: (dimensions: ImageDimensions) => void;
};
export default function Reimagine({ width, height, onSelectImage, onEdit }: ReimagineProps): JSX.Element;
export {};
