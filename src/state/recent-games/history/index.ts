import { Slice } from "../../Slice.ts";
import { RecentGamesState } from "../index.ts";

type PastGame = {
  armies: string;
  alliance: string;
  points: number;
  bows: number;
  gameDate?: string;
  duration?: number;
  opponentArmies?: string;
  opponentName?: string;
  result: string;
  victoryPoints: number;
  scenarioPlayed?: string;
};

export type GameHistoryState = {
  showHistory: boolean;
  setShowHistory: (value: boolean) => void;

  recentGames: PastGame[];
  addGame: (game: PastGame) => void;
};

const initialState = {
  showHistory: false,
  recentGames: [],
};

export const historySlice: Slice<RecentGamesState, GameHistoryState> = (
  set,
) => ({
  ...initialState,

  setShowHistory: (value: boolean) =>
    set(() => ({ showHistory: value }), undefined, "SHOW_HISTORY"),

  addGame: (game) =>
    set(
      ({ recentGames }) => ({ recentGames: [...recentGames, game] }),
      undefined,
      "ADD_GAME_RESULTS",
    ),
});
