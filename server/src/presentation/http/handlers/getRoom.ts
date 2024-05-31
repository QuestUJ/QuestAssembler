import {
    ErrorCode,
    GetRoomResponse,
    QuasmComponent,
    QuasmError
} from '@quasm/common';
import { UUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { DataAccessFacade } from '@/repositories/DataAccessFacade';

import { getRoomCheckUser } from './utils';

export function addGetRoomHandler(
    fastify: FastifyInstance,
    dataAccess: DataAccessFacade
) {
    fastify.get<{
        Reply: GetRoomResponse;

        Params: {
            roomID: string;
        };
    }>('/getRoom/:roomID', async (request, reply) => {
        const room = await getRoomCheckUser({
            roomID: request.params.roomID as UUID,
            userID: request.user.userID,
            roomRepo: dataAccess.roomRepository
        });

        if (!room.characters.hasUser(request.user.userID)) {
            throw new QuasmError(
                QuasmComponent.HTTP,
                400,
                ErrorCode.RoomNotFound,
                'Player not in room'
            );
        }

        const currentPlayer = room.characters.getCharacterByUserID(
            request.user.userID
        );

        await reply.send({
            success: true,
            payload: {
                id: room.id,
                roomName: room.roomSettings.getName(),
                gameMasterID: room.characters.getGameMaster().id,
                maxPlayers: room.roomSettings.getMaxPlayerCount(),
                currentPlayer: {
                    id: currentPlayer.id,
                    nick: currentPlayer.getNick(),
                    profileIMG: currentPlayer.getProfileImageURL(),
                    isReady: !!currentPlayer.getTurnSubmit()
                }
            }
        });
    });
}
