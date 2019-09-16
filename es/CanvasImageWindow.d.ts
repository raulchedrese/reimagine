/// <reference types="react" />
declare type CanvasImageWindowProps = {
    width: number;
    height: number;
    imageSource: string;
    clearImage: any;
    setIsEditing: any;
    setImageDimensions: any;
    initialDimensions: {
        scale: number;
        left: number;
        top: number;
        scaledHeight: number;
        scaledWidth: number;
    } | null;
};
export default function CanvasImageWindow({ width, height, imageSource, clearImage, setIsEditing, setImageDimensions, initialDimensions }: CanvasImageWindowProps): JSX.Element;
export {};
