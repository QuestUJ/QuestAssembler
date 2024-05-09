import { zodResolver } from '@hookform/resolvers/zod';
import {
  ErrorCode,
  ErrorMap,
  MAX_CHARACTER_DESCRIPTION_LENGTH,
  MAX_CHARACTER_NICK_LENGTH
} from '@quasm/common';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useToast } from '@/components/ui/use-toast';

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

export function CharacterSettingsDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nick: '',
      description: ''
    }
  });

  // override and fill with actual settings change on the backend
  const changeCharacterSettingsHandler = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='m-0 h-10 w-10 rounded p-0'>
          <Settings className='h-full text-background' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Character settings</DialogTitle>
          <DialogDescription>
            Customize your character nick and descreption
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data: z.infer<typeof formSchema>) => {
              form.reset(undefined, { keepDirtyValues: true }); // keepDirtyValues here, I don't feel like we should ever reset this (after unsuccessful change user probably wants to use existing input anyway)
              changeCharacterSettingsHandler(data); // if we want to reset to default after successful change, we need to add a success handler with form.reset() in it (refer to create game dialog)
              setOpen(false);
            })}
          >
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
                    <Input {...field} placeholder='Max amount of players' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Apply</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
