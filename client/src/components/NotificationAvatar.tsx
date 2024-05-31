export interface AvatarProps {
  nick: string;
  profileIMG?: string;
}

export function NotificationAvatar({ nick, profileIMG }: AvatarProps) {
  return <img className='rounded-full' src={profileIMG} alt={nick} />;
}
