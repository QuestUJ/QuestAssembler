import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function CopyGameCode({ gameCode }: { gameCode: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.origin}/joinRoom/${gameCode}`
      );
      toast('Invitation link copied to clipboard');
    } catch (error) {
      toast('Failed to copy the invitation. Please try again.');
    }
  };

  return (
    <Button
      className='m-0 h-10 w-10 rounded p-0'
      onClick={() => void handleCopy()}
    >
      <svg
        width='24px'
        height='24px'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
      >
        <path
          fill='#000000'
          fillRule='evenodd'
          d='M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm9 4V4H4v9h2V8a2 2 0 012-2h5zM8 8h9v9H8V8z'
          strokeWidth='0.1'
        />
      </svg>
    </Button>
  );
}
