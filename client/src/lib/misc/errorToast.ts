import { useEffect } from 'react';
import { toast } from 'sonner';

import { buildResponseErrorToast } from '../toasters';

export function useErrorToast(flag: boolean, err?: string) {
  useEffect(() => {
    if (flag) {
      toast.error(...buildResponseErrorToast(err));
    }
  }, [flag, err]);
}
