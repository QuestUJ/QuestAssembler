import { zodResolver } from '@hookform/resolvers/zod';
import {
  AVATAR_PIXEL_HEIGHT,
  AVATAR_PIXEL_WIDTH,
  ErrorCode,
  ErrorMap,
  MAX_AVATAR_FILE_SIZE_IN_BYTES,
  MAX_CHARACTER_DESCRIPTION_LENGTH,
  MAX_CHARACTER_NICK_LENGTH
} from '@quasm/common';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import shortUUID from 'short-uuid';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/lib/stores/socketIOStore';
import { buildResponseErrorToast, SocketErrorTxt } from '@/lib/toasters';

import { ImageHandler } from '../ImageHandler';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';

const formSchema = z.object({
  nick: z
    .string()
    .min(1, {
      message: ErrorMap[ErrorCode.NickLengthEmpty]
    })
    .max(MAX_CHARACTER_NICK_LENGTH, {
      message: ErrorMap[ErrorCode.NickLengthTooLong]
    }),
  description: z.string().max(MAX_CHARACTER_DESCRIPTION_LENGTH, {
    message: ErrorMap[ErrorCode.DescriptionLength]
  }) // empty description is allowed, can be changed if needed
});

export interface CharacterSettingsProps {
  nick: string;
  profilePicture?: string;
}

export function CharacterSettingsDialog(props: CharacterSettingsProps) {
  const [open, setOpen] = useState(false);
  const socket = useSocket();
  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  const [selectedImage, setSelectedImage] = useState<Blob>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nick: '',
      description: ''
    }
  });

  const formHandler: SubmitHandler<z.infer<typeof formSchema>> = async data => {
    if (!socket) {
      toast.error(SocketErrorTxt);
      return;
    }

    if (
      selectedImage !== undefined &&
      selectedImage.size > MAX_AVATAR_FILE_SIZE_IN_BYTES
    ) {
      toast.error(
        ...buildResponseErrorToast(
          'The file is too big! Modify it by clicking Modify image button.'
        )
      );
      return;
    }
    // prepare image for being sent over the network
    const convertedSelectedImage = selectedImage
      ? new Uint8Array(await selectedImage.arrayBuffer())
      : undefined;
    socket.emit(
      'changeCharacterSettings',
      {
        roomID: shortUUID().toUUID(roomId),
        avatar: convertedSelectedImage,
        ...data
      },
      res => {
        if (res.success) {
          toast('Character settings changed successfully');
        } else {
          toast.error(...buildResponseErrorToast(res.error?.message));
        }
      }
    );

    form.reset(undefined, { keepDirtyValues: true }); // keepDirtyValues here, I don't feel like we should ever reset this (after unsuccessful change user probably wants to use existing input anyway)
    setOpen(false);
  };

  const imageHandlerCallback = (imageBlob: Blob) => {
    setSelectedImage(imageBlob);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex h-full items-center rounded-md p-2 hover:bg-highlight'>
          <img
            src={props.profilePicture}
            className='mr-2 aspect-square h-full rounded-full'
            alt='current player character picture'
          />
          <h1 className='font-decorative text-2xl'>{props.nick}</h1>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Character settings</DialogTitle>
          <DialogDescription>
            Customize your character nick and description
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={e => void form.handleSubmit(formHandler)(e)}>
            <FormField
              control={form.control}
              name='nick'
              render={({ field }) => (
                <FormItem className='mb-4'>
                  <FormControl>
                    <Input {...field} placeholder='Character nick' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='mb-4'>
                  <FormControl>
                    <Input {...field} placeholder='Character description' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex h-fit w-full justify-center'>
              <ImageHandler
                handlerId='avatar_image'
                width={AVATAR_PIXEL_WIDTH}
                height={AVATAR_PIXEL_HEIGHT}
                className='max-h-56 max-w-36'
                callback={imageHandlerCallback}
                removeSelectionCallback={() => setSelectedImage(undefined)}
              />
            </div>
            <div className='flex justify-between'>
              <Button
                className='bg-supporting'
                type='button'
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type='submit'>Apply</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
