import { useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../ui/button';
import ImageEditor, {type Position} from 'react-avatar-editor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../ui/use-toast';
import { buildResponseErrorToast } from '@/lib/toasters';

type ImageState = {
  position: Position
  scale: number
  rotate: number
}

interface ImageEditDialogProps {
  image: File;
  handleSave: (imageBlob: Blob) => void;
  width: number;
  height: number;
};


function ImageEditDialog({image, handleSave, width, height}: ImageEditDialogProps) {
  const imageEditorRef = useRef<ImageEditor>(null);
  const [open, setOpen] = useState(false);
  const [imageState, setImageState] = useState<ImageState>(
    {
      scale: 1,
      rotate: 0,
      position: {
        x: 0,
        y: 0
      }
    }
  );

  const handlePositionChange = (position: Position) => {
    setImageState({
      ...imageState,
      position
    })
  }

  const handleScaleChange = (scale: number) => {
    setImageState({
      ...imageState,
      scale
    })
  }

  const rotateLeft = () => {
    setImageState({
      ...imageState,
      rotate: (imageState.rotate - 90) % 360
    })
  }

  const rotateRight = () => {
    setImageState({
      ...imageState,
      rotate: (imageState.rotate + 90) % 360
    })
  }

  const { toast } = useToast();

  const convertEditedImageToBlob = async () => {
    const dataUrl = imageEditorRef.current?.getImageScaledToCanvas().toDataURL();
    if (!dataUrl) {
      toast(buildResponseErrorToast("Something went wrong when saving the image."));
    }
    const res = await fetch(dataUrl!);
    return (await res.blob());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=''>
          Click here to modify the picture
        </Button>
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
        <label>Scale: <input type="range" min="1" max="4" step="0.01" value={imageState.scale} onChange={(e) => handleScaleChange(Number(e.target.value))}/></label>
        <Button onClick={rotateRight}>Rotate right</Button>
        <Button onClick={rotateLeft}>Rotate left</Button>
        <Button onClick={async () => {
          const imageBlob = await convertEditedImageToBlob();
          handleSave(imageBlob);
          setOpen(false);
        }}>Save changes</Button>
      </DialogContent>
    </Dialog>
  )
}

interface ImageHandlerProps {
  callback: (imageBlob: Blob, imageURL: string) => void;
  width: number;
  height: number;
};

// callback will be run after the image is saved and is used to synchronize the component with its environment
export function ImageHandler({callback, width, height}: ImageHandlerProps) {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [selectedImageURL, setSelectedImageURL] = useState<string>();
  const filePickerRef = useRef<HTMLInputElement>(null) // unfortunately value for input type="file" component can't be set programatically, so have to use ref

  const imageInputChangeHandler = (files: FileList | null) => {
    if (!files) {
      return;
    }
    //validate
    const imageURL = URL.createObjectURL(files[0]);
    setSelectedImage(files[0]);
    setSelectedImageURL(URL.createObjectURL(files[0]));
    callback(files[0], imageURL);
  };

  const handleSave = (imageBlob: Blob) => {
    const imageURL = URL.createObjectURL(imageBlob);
    setSelectedImageURL(imageURL);
    callback(imageBlob, imageURL);
  }


  return (
    <div className='flex h-80 w-80 items-center justify-center rounded-md bg-background lg:h-full lg:w-full'>
      {selectedImage ? (
        <div className="h-full w-full">
          <img className='h-full w-full aspect-square' src={selectedImageURL} />
          <ImageEditDialog image={selectedImage} handleSave={handleSave} width={width} height={height}/>
        </div>
      ) : (
        <>
          <input type="file" accept="image/png, image/gif, image/jpeg" ref={filePickerRef} onChange={e => imageInputChangeHandler(e.target.files)}/>
        </>
      )}
    </div>
  );
}
