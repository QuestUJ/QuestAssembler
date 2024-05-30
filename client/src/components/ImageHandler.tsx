import 'react-image-crop/dist/ReactCrop.css';

import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ImageEditDialog } from './dialogs/ImageEditDialog';
import { Button } from './ui/button';

interface ImageHandlerProps {
  callback?: (imageBlob: Blob, imageURL: string) => void;
  width: number;
  height: number;
  className?: string;
}

// callback will be run after the image is saved and is used to synchronize the component with its environment
export function ImageHandler({
  callback,
  width,
  height,
  className
}: ImageHandlerProps) {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [selectedImageURL, setSelectedImageURL] = useState<string>();
  const filePickerRef = useRef<HTMLInputElement>(null); // unfortunately value for input type="file" component can't be set programatically, so have to use ref

  const imageInputChangeHandler = (files: FileList | null) => {
    if (!files) {
      return;
    }
    //validate
    const imageURL = URL.createObjectURL(files[0]);
    setSelectedImage(files[0]);
    setSelectedImageURL(URL.createObjectURL(files[0]));
    if (callback) {
      callback(files[0], imageURL);
    }
  };

  const handleSave = (imageBlob: Blob) => {
    const imageURL = URL.createObjectURL(imageBlob);
    setSelectedImageURL(imageURL);
    if (callback) {
      callback(imageBlob, imageURL);
    }
  };

  return (
    <div
      className={twMerge(
        `flex h-80 h-full w-80 w-full items-center justify-center rounded-md bg-background ${className}`
      )}
    >
      {selectedImage ? (
        <div className='h-full w-full'>
          <img
            className='mb-1 aspect-square h-full w-full'
            src={selectedImageURL}
          />
          <ImageEditDialog
            image={selectedImage}
            handleSave={handleSave}
            width={width}
            height={height}
          />
          <Button
            className='my-1 w-full bg-white text-sm'
            onClick={() => {
              setSelectedImage(undefined);
              setSelectedImageURL(undefined);
            }}
          >
            Remove image selection
          </Button>
        </div>
      ) : (
        <>
          <input
            id='image_picker'
            type='file'
            accept='image/png, image/gif, image/jpeg'
            className=''
            ref={filePickerRef}
            onChange={e => imageInputChangeHandler(e.target.files)}
          />
        </>
      )}
    </div>
  );
}
