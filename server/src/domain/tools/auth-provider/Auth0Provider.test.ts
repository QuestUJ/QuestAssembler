import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { Auth0Provider } from './Auth0Provider';

describe('Auth0Provider', async () => {
    const { privateKey, publicKey } = await generateKeyPair('RS256');

    const userID = 'auth0:testuser';
    const domain = 'test.domain';
    const audience = 'audience';

    // prepare some tokens:

    // Correctly signed token
    const validToken = await new SignJWT()
        .setProtectedHeader({
            alg: 'RS256'
        })
        .setIssuer(`https://${domain}/`)
        .setAudience(audience)
        .setSubject(userID)
        .setExpirationTime('2h')
        .sign(privateKey);

    // Token with tampered signature, shouldn't even pass jwt verification'
    const invalidSignature = validToken.replace(
        /^([^.]*\.[^.]*\.).*$/,
        '$1WkVkV2VtUklUbXRhWjI4OUNnPT0K'
    );

    // If audiences do not match verification also should failed according to the auth0 docs
    // https://auth0.com/docs/secure/tokens/access-tokens/validate-access-tokens
    const invalidAudience = await new SignJWT()
        .setProtectedHeader({
            alg: 'RS256'
        })
        .setIssuer(`https://${domain}/`)
        .setAudience('randomunmatchedaudience')
        .setSubject(userID)
        .setExpirationTime('2h')
        .sign(privateKey);

    const jwks = await exportJWK(publicKey);

    // AUTH0 will serve JSON WEB KEY SETS through this url, here we use simple mock
    const restHandlers = [
        http.get(`https://${domain}/.well-known/jwks.json`, () => {
            return HttpResponse.json({
                keys: [jwks]
            });
        }),
        http.get(`https://${domain}/userinfo`, () => {
            return HttpResponse.json({});
        })
    ];

    const server = setupServer(...restHandlers);

    beforeAll(() => server.listen());
    afterAll(() => server.close());
    afterEach(() => server.resetHandlers());

    const auth = new Auth0Provider({
        domain,
        audience
    });

    it('should return UserDetails based on valid access token', async () => {
        const { userID: returnedID } = await auth.verify(validToken);

        expect(userID).toEqual(returnedID);
    });

    it('should throw on invalid signature', async () => {
        await expect(() => auth.verify(invalidSignature)).rejects.toThrowError(
            /.*Unauthorized.*/
        );
    });

    it('should throw on unmatched audience', async () => {
        await expect(() => auth.verify(invalidAudience)).rejects.toThrowError(
            /.*Unauthorized.*/
        );
    });
});
