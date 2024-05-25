import { ApiResponse, ErrorCode } from '@quasm/common';

import { config } from '@/config';

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

interface GetCall {
  path: string;
  token: string;
  onError?: (code: ErrorCode, message: string) => void | Promise<void>;
}

export async function fetchGET<Payload>({ path, token, onError }: GetCall) {
  const response = (await fetch(`${API_BASE_URL}/api/v1${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    signal: AbortSignal.timeout(10000)
  }).then(res => res.json())) as ApiResponse<Payload>;

  if (!response.success) {
    if (onError) await onError(response.error!.code, response.error!.message);

    const err = new Error(response.error?.message);
    err.name = response.error!.code;
    throw err;
  }

  return response.payload! as Payload;
}
