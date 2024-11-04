import { Slice } from "../../Slice.ts";
import { RecentGamesState } from "../index.ts";

export type PastGame = {
  id: string;
  // Game Meta Data
  gameDate?: string;
  duration?: number;
  points: number;
  result: "Won" | "Lost" | "Draw";
  scenarioPlayed?: string;
  tags: string[];

  // Player/User data
  armies: string;
  alliance: string;
  bows: number;
  victoryPoints: number;

  // Opponent data
  opponentName?: string;
  opponentArmies?: string;
  opponentVictoryPoints?: number;
};

export type GameHistoryState = {
  showHistory: boolean;
  setShowHistory: (value: boolean) => void;

  recentGames: PastGame[];
  addGame: (game: PastGame) => void;
  editGame: (game: PastGame) => void;
  deleteGame: (gameId: string) => void;
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
  editGame: (game) =>
    set(
      ({ recentGames }) => ({
        recentGames: recentGames.map((eGame) =>
          game.id === eGame.id ? game : eGame,
        ),
      }),
      undefined,
      "EDIT_GAME_RESULTS",
    ),

  deleteGame: (gameId) =>
    set(
      ({ recentGames }) => ({
        recentGames: recentGames.filter((game) => game.id !== gameId),
      }),
      undefined,
      "DELETE_GAME_RESULTS",
    ),
});
