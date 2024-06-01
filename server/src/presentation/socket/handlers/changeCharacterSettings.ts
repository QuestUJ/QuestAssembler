import { UUID } from 'crypto';

import { HandlerConfig } from './HandlerConfig';
import { withErrorHandling } from './withErrorHandling';

export function changeCharacterSettingsHandler({
    io,
    socket,
    dataAccess,
    fileStorageProvider
}: HandlerConfig) {
    socket.on('changeCharacterSettings', (data, respond) => {
        withErrorHandling(async () => {
            const currentCharacter = (
                await dataAccess.roomRepository.getRoomByID(data.roomID as UUID)
            ).characters.getCharacterByUserID(socket.data.userID);

            let profileImageURL = '';
            if (data.avatar) {
                profileImageURL = await fileStorageProvider.uploadAvatar(
                    data.avatar,
                    data.roomID,
                    currentCharacter.getProfileImageURL()
                );
                await currentCharacter.setProfileImage(profileImageURL);
            }

            await currentCharacter.setNick(data.nick);
            await currentCharacter.setDescription(data.description);

            io.in(data.roomID).emit('changeCharacterDetails', {
                id: currentCharacter.id,
                nick: currentCharacter.getNick(),
                description: currentCharacter.getDescription(),
                profileIMG: currentCharacter.getProfileImageURL(),
                isReady: !!currentCharacter.getTurnSubmit()
            });

            respond({
                success: true
            });
        }, respond);
    });
}
