import { useAuth0 } from '@auth0/auth0-react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Settings } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export function CharacterSettingsDialog() {
  const [nick, setNick] = useState('');
  const [description, setDescription] = useState('');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { toast } = useToast();

  const applySettings = () => {
    sendEvent('updateCharacter', {
      nick: this.nick,
      description: this.description
    });
  };

  return (
    <Dialog>
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
        <div>
          <Input
            type='text'
            placeholder='Character nick'
            value={nick}
            onChange={e => setNick(e.target.value)}
            className='mb-4'
          />
          <Input
            type='text'
            placeholder='Character description'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='submit' onClick={applySettings}>
              Apply
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
