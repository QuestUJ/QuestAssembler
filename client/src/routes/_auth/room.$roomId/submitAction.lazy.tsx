import { ApiTurnSubmitPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, getRouteApi } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import shortUUID from 'short-uuid';

import { SvgSpinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useApiGet } from '@/lib/api';
import { useSocket } from '@/lib/socketIOStore';
import { getResponseErrorToast, SocketErrorToast } from '@/lib/toasters';

const route = getRouteApi('/_auth/room/$roomId/submitAction');

function PlayerSubmit() {
  const [content, setContent] = useState('');

  const socket = useSocket();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  const { data, isPending } = useApiGet<ApiTurnSubmitPayload>({
    path: `/getTurnSubmit/${roomUUID}`,
    queryKey: ['getTurnSubmit', roomUUID]
  });

  const submit = () => {
    if (!socket) {
      toast(SocketErrorToast);
      return;
    }

    socket.emit(
      'submitAction',
      {
        roomID: roomUUID,
        content
      },
      res => {
        if (res.success) {
          toast({
            title: 'Action submitted!'
          });

          const { content, timestamp } = res.payload!;
          queryClient.setQueryData(['getTurnSubmit', roomUUID], {
            content,
            timestamp
          });
        } else {
          toast(getResponseErrorToast(res.error));
        }
      }
    );
  };

  if (isPending) {
    return (
      <div className='flex h-full w-full justify-center pt-20'>
        <SvgSpinner className='h-20 w-20' />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className='flex h-full w-full flex-col  items-center  pt-20'>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className=' h-1/3 w-2/3'
          placeholder='Describe your actions in this turn'
        />
        <div className='flex w-2/3 justify-end py-4'>
          <Button
            className='flex w-48 items-center gap-2 font-bold'
            onClick={submit}
          >
            <CheckCircle />
            Submit action
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full justify-center pt-20'>
      <Card className='h-fit min-w-96'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Action submitted <CheckCircle className='h-10 w-10 text-primary' />
          </CardTitle>
          <CardDescription>
            {new Date(data!.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-4'>
          <p>{data?.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createLazyFileRoute('/_auth/room/$roomId/submitAction')({
  component: PlayerSubmit
});
