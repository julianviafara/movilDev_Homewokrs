export interface MissionDef {
  id: number;
  title: string;
  description: string;
  points: number;
}

export interface MissionState {
  id: number;
  completed: boolean;
}

export interface Progress {
  points: number;
  missions: MissionState[];
}

export interface RankingEntry {
  uid: string;
  name: string;
  points: number;
  isMe: boolean;
}
