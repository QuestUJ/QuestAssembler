import { AUTH0_DOMAIN } from '@/env';

import { IDToken } from './types';

export async function getUserProfile(jwtAccessToken: string) {
    const res = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
            Authorization: `Bearer ${jwtAccessToken}`
        }
    });
    const data: IDToken = (await res.json()) as IDToken;
    return data;
}
