import { config } from '@/config';

import { IDToken } from './types';

const { AUTH0_DOMAIN } = config.pick(['AUTH0_DOMAIN']);

export async function getUserProfile(jwtAccessToken: string) {
    const res = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
            Authorization: `Bearer ${jwtAccessToken}`
        }
    });
    const data: IDToken = (await res.json()) as IDToken;
    return data;
}
