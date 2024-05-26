export interface TurnSubmitDetails {
  content: string;
  timestamp: string;
}

export interface CharacterDetails {
  profileIMG?: string;
  nick: string;
  characterID: string;
  submit: TurnSubmitDetails | null;
}
