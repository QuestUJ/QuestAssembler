import { useRef, useState } from 'react';
import ImageEditor, { type Position } from 'react-avatar-editor';
import { toast } from 'sonner';

import { buildResponseErrorToast } from '@/lib/toasters';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

type ImageState = {
  position: Position;
  scale: number;
  rotate: number;
};

interface ImageEditDialogProps {
  image: File;
  handleSave: (imageBlob: Blob) => void;
  width: number;
  height: number;
}

export function ImageEditDialog({
  image,
  handleSave,
  width,
  height
}: ImageEditDialogProps) {
  const imageEditorRef = useRef<ImageEditor>(null);
  const [open, setOpen] = useState(false);
  const [imageState, setImageState] = useState<ImageState>({
    scale: 1,
    rotate: 0,
    position: {
      x: 0,
      y: 0
    }
  });

  const handlePositionChange = (position: Position) => {
    setImageState({
      ...imageState,
      position
    });
  };

  const handleScaleChange = (scale: number) => {
    setImageState({
      ...imageState,
      scale
    });
  };

  const rotateLeft = () => {
    setImageState({
      ...imageState,
      rotate: (imageState.rotate - 90) % 360
    });
  };

  const rotateRight = () => {
    setImageState({
      ...imageState,
      rotate: (imageState.rotate + 90) % 360
    });
  };

  const convertEditedImageToBlob = async () => {
    const dataUrl = imageEditorRef.current
      ?.getImageScaledToCanvas()
      .toDataURL();
    if (!dataUrl) {
      toast.error(
        ...buildResponseErrorToast(
          'Something went wrong when saving the image.'
        )
      );
    }
    const res = await fetch(dataUrl!);
    return await res.blob();
  };

  const submitChangesHandler = async () => {
    const imageBlob = await convertEditedImageToBlob();
    handleSave(imageBlob);
    setOpen(false);
    // no-misused-promises fix
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>Modify image</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Modify the image</DialogTitle>
        </DialogHeader>
        <ImageEditor
          ref={imageEditorRef}
          scale={imageState.scale}
          image={image}
          width={width}
          height={height}
          position={imageState.position}
          onPositionChange={handlePositionChange}
          disableCanvasRotation={true}
          rotate={imageState.rotate}
        />
        <label>
          Scale:{' '}
          <input
            type='range'
            min='1'
            max='4'
            step='0.01'
            value={imageState.scale}
            onChange={e => handleScaleChange(Number(e.target.value))}
          />
        </label>
        <Button onClick={rotateRight}>Rotate right</Button>
        <Button onClick={rotateLeft}>Rotate left</Button>
        <Button onClick={() => void submitChangesHandler()}>
          Save changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
