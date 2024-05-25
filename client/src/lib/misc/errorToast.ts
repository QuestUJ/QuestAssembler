import { useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

import { buildResponseErrorToast } from '../toasters';

export function useErrorToast(flag: boolean, err?: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (flag) {
      toast(buildResponseErrorToast(err));
    }
  }, [flag, err, toast]);
}
