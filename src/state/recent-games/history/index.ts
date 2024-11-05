import { v4 } from "uuid";
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
  importGames: (
    games: PastGame[],
    onDuplicate: "overwrite" | "ignore" | "create-new",
  ) => void;
  editGame: (game: PastGame) => void;
  deleteGame: (gameId: string) => void;
};

const initialState = {
  showHistory: false,
  recentGames: [],
};

function overwriteExistingGames(games: PastGame[], recentGames: PastGame[]) {
  const importedGameIds = games.map((game) => game.id);
  return {
    recentGames: [
      // filter existing games where id also exists in the import
      ...recentGames.filter((game) => !importedGameIds.includes(game.id)),
      ...games,
    ],
  };
}

function ignoreExistingGamesInImport(
  recentGames: PastGame[],
  games: PastGame[],
) {
  const existingGameIds = recentGames.map((game) => game.id);
  return {
    recentGames: [
      ...recentGames,
      // filter new games where id already exists in the state
      ...games.filter((game) => !existingGameIds.includes(game.id)),
    ],
  };
}

function generateNewIdsOnImportedGames(
  recentGames: PastGame[],
  games: PastGame[],
) {
  return {
    recentGames: [
      ...recentGames,
      // generate a new id for each game to make sure they never overlap with existing games.
      ...games.map((game) => ({ ...game, id: v4() })),
    ],
  };
}

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
  importGames: (games, onDuplicate) =>
    set(
      ({ recentGames }) => {
        switch (onDuplicate) {
          case "overwrite": // take imported games over the existing ones.
            return overwriteExistingGames(games, recentGames);
          case "ignore": // take existing games over the new ones.
            return ignoreExistingGamesInImport(recentGames, games);
          case "create-new": // Create a new game for all the imported games, risk of duplicate games!
            return generateNewIdsOnImportedGames(recentGames, games);
        }
      },
      undefined,
      "IMPORT_GAME_RESULTS",
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
