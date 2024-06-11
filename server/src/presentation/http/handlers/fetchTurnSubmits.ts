import {
    ApiTurnSubmitWithCharacterPayload,
    ErrorCode,
    FetchTurnSubmitsResponse,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addFetchTurnSubmitsHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Params: {
            roomId: string;
        };
        Reply: FetchTurnSubmitsResponse;
    }>('/fetchTurnSubmits/:roomId', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomId as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        const character = room.characters.getCharacterByUserID(
            request.user.userID
        );

        if (!character.isGameMaster) {
            throw new QuasmError(
                QuasmComponent.HTTP,
                401,
                ErrorCode.CantViewOtherActions,
                `${request.user.userID} tried to access other players submits`
            );
        }

        const submits: ApiTurnSubmitWithCharacterPayload[] = room.characters
            .getCharacters()
            .filter(ch => ch.id !== character.id)
            .map(ch => {
                const submit = ch.getTurnSubmit();

                return {
                    characterID: ch.id,
                    nick: ch.getNick(),
                    profileIMG: ch.getProfileImageURL(),
                    submit: submit
                        ? {
                              content: submit.content,
                              timestamp: submit.timestamp.toISOString()
                          }
                        : null
                };
            });

        await reply.send({
            success: true,
            payload: submits
        });
    });
}
