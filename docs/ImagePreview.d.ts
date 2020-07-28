/// <reference types="react" />
declare type ImagePreviewProps = {
    imageSource: string;
    width: number;
    height: number;
    imageDimensions: {
        scale: number;
        left: number;
        top: number;
        scaledHeight: number;
        scaledWidth: number;
    };
    startEditing: () => void;
};
export default function ImagePreview({ imageSource, width, height, imageDimensions, startEditing }: ImagePreviewProps): JSX.Element;
export {};
