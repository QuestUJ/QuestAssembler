import { ApiResponse } from '@quasm/common';

import { config } from '@/config';

interface PostCall<Body> {
  path: string;
  body: Body;
  token: string;
}

const { API_BASE_URL } = config.pick(['API_BASE_URL']);

export async function fetchPOST<ResponsePayload, Body>({
  path,
  token,
  body
}: PostCall<Body>) {
  const response = (await fetch(`${API_BASE_URL}/api/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000)
  }).then(res => res.json())) as ApiResponse<ResponsePayload>;

  if (!response.success) {
    throw new Error(response.error?.message);
  }

  return response.payload! as ResponsePayload;
}
