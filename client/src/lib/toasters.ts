export const SocketErrorToast: { title: string; variant: 'destructive' } = {
  title: 'Connection issue! Try refreshing site!',
  variant: 'destructive'
};

export function buildResponseErrorToast(error?: string): {
  title: string;
  variant: 'destructive';
  description: string | undefined;
} {
  return {
    title: 'Something went wrong!',
    variant: 'destructive',
    description: error
  };
}
