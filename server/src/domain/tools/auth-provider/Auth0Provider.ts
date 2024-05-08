import {
    ErrorCode,
    extractMessage,
    QuasmComponent,
    QuasmError,
    type UserDetails
} from '@quasm/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { IAuthProvider } from './IAuthProvider';

interface Config {
    domain: string;
    audience: string;
}

/**
 * {@link IAuthProvider} implementation based on Auth0
 */
export class Auth0Provider implements IAuthProvider {
    private readonly issuer: string;

    constructor(private config: Config) {
        this.issuer = `https://${this.config.domain}/`;
    }

    async verify(token: string): Promise<string> {
        try {
            const jwks = createRemoteJWKSet(
                new URL(`${this.issuer}.well-known/jwks.json`)
            );

            // Basic verification, key signatures, expiration, issuer and audience claims
            const { payload } = await jwtVerify(token, jwks, {
                issuer: this.issuer,
                audience: this.config.audience
            });

            // Ensure sub claim exists
            if (payload.sub === undefined) {
                throw new QuasmError(
                    QuasmComponent.AUTH,
                    401,
                    ErrorCode.IncorrectAccessToken,
                    `Missing sub claim in token: ${JSON.stringify(payload)}`
                );
            }

            return payload.sub;
        } catch (e) {
            // If error is already of proper format we don't have to process it'
            if (e instanceof QuasmError) {
                throw e;
            }

            // Rethrow an instance of our Erorr indicating location and status code
            const err = extractMessage(e);
            throw new QuasmError(
                QuasmComponent.AUTH,
                401,
                ErrorCode.Unexpected,
                `Unauthorized, ${err}`
            );
        }
    }

    async fetchUserDetails(token: string): Promise<UserDetails> {
        try {
            // Fetch user details from external endpoint
            const { sub, nickname, picture, email } = (await fetch(
                `${this.issuer}userinfo/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(res => res.json())) as {
                sub: string;
                nickname: string;
                picture: string;
                email: string;
            };

            return {
                userID: sub,
                nickname,
                email,
                profileImg: picture
            };
        } catch (e) {
            // If error is already of proper format we don't have to process it'
            if (e instanceof QuasmError) {
                throw e;
            }

            // Rethrow an instance of our Erorr indicating location and status code
            const err = extractMessage(e);
            throw new QuasmError(
                QuasmComponent.AUTH,
                401,
                ErrorCode.Unexpected,
                `Unauthorized, ${err}`
            );
        }
    }
}
