// make nickname shorter according to viewport size
export enum NicknameDisplayStyle {
  LONG = 'LONG',
  MEDIUM = 'MEDIUM',
  SHORT = 'SHORT'
}

const SMALL_SCREEN_MAX_WIDTH = 480;
const MEDIUM_SCREEN_MAX_WIDTH = 768;

const LONG_DISPLAY_SMALL_SCREEN_NICK_LENGTH = 20;
const LONG_DISPLAY_MEDIUM_SCREEN_NICK_LENGTH = 32;

const SHORT_DISPLAY_LONG_NICKNAME_LENGTH = 13;
const MEDIUM_DISPLAY_LONG_NICKNAME_LENGTH = 24;

export function displayNickname(
  nick: string,
  style: NicknameDisplayStyle,
  screenWidth?: number
) {
  if (style == NicknameDisplayStyle.LONG) {
    if (screenWidth && screenWidth < SMALL_SCREEN_MAX_WIDTH) {
      return nick.substring(0, LONG_DISPLAY_SMALL_SCREEN_NICK_LENGTH) + '...';
    } else if (screenWidth && screenWidth < MEDIUM_SCREEN_MAX_WIDTH) {
      return nick.substring(0, LONG_DISPLAY_MEDIUM_SCREEN_NICK_LENGTH) + '...';
    } else {
      return nick;
    }
  } else if (style == NicknameDisplayStyle.MEDIUM) {
    if (nick.length > MEDIUM_DISPLAY_LONG_NICKNAME_LENGTH) {
      return nick.substring(0, MEDIUM_DISPLAY_LONG_NICKNAME_LENGTH - 3) + '...';
    } else {
      return nick;
    }
  } else {
    if (nick.length > SHORT_DISPLAY_LONG_NICKNAME_LENGTH) {
      return nick.substring(0, SHORT_DISPLAY_LONG_NICKNAME_LENGTH - 3) + '...';
    } else {
      return nick;
    }
  }
}
