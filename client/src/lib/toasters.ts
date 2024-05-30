export const SocketErrorTxt = 'Connection issue! Try refreshing site!';

export function buildResponseErrorToast(error?: string): [
  string,
  {
    description: string | undefined;
  }
] {
  return [
    'Something went wrong!',
    {
      description: error
    }
  ];
}
