import { getSumOfUnits } from "../../../components/common/roster/totalUnits.ts";
import { GameModeHero } from "../../../components/gamemode/types.ts";
import { AllianceLevel } from "../../../constants/alliances.ts";
import { Faction } from "../../../types/factions.ts";
import { Roster } from "../../../types/roster.ts";
import { Unit } from "../../../types/unit.ts";
import { Slice } from "../../Slice.ts";
import { GameModeState } from "../index.ts";
import { createGameState } from "./create-game-state.ts";

export type Game = {
  heroes: Record<string, GameModeHero[]>;
  casualties: number;
  heroCasualties: number;
  started: number;
  lastUpdated: number;
};

export type GameMetaData = {
  factions: Faction[];
  heroes: Pick<Unit, "name" | "unit_type" | "quantity" | "profile_origin">[];
  alliance: AllianceLevel;
  iGameState: Pick<Game, "heroes">;
  points: number;
  bows: number;
};

export type GameState = {
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
  gameState?: Game;
  gameMetaData?: GameMetaData;
  startNewGame: (roster: Roster, allianceLevel: AllianceLevel) => void;
  restartGame: () => void;
  updateGameState: (update: Partial<Game>) => void;
  initializeGameState: () => void;
};

const initialState = {
  gameMode: false,
  gameState: null,
  gameMetaData: null,
};

export const gameStateSlice: Slice<GameModeState, GameState> = (set) => ({
  ...initialState,

  setGameMode: (gameMode) => set({ gameMode }, undefined, "SET_GAME_MODE"),
  startNewGame: (roster: Roster, allianceLevel: AllianceLevel) =>
    set(
      () => {
        return {
          gameMode: true,
          gameState: {
            ...createGameState(roster),
            started: Date.now(),
            lastUpdated: Date.now(),
          },
          gameMetaData: {
            iGameState: createGameState(roster),
            factions: [
              ...new Set(
                roster.warbands
                  .flatMap((wb) => wb.hero?.faction)
                  .filter((f) => !!f),
              ),
            ],
            alliance: allianceLevel,
            bows: roster.bow_count,
            points: roster.points,
            heroes: getSumOfUnits(roster)
              .filter((unit) => unit.unit_type.includes("Hero"))
              .map((hero) => ({
                name: hero.name,
                quantity: hero.quantity,
                unit_type: hero.unit_type,
                profile_origin: hero.profile_origin,
              })),
          } as GameMetaData,
        };
      },
      undefined,
      "START_GAME",
    ),
  restartGame: () =>
    set(
      ({ gameMetaData: { iGameState } }) => {
        return {
          gameMode: true,
          gameState: {
            // Small hack to remove memory reference to original object.
            ...JSON.parse(JSON.stringify(iGameState)),
            started: Date.now(),
            lastUpdated: Date.now(),
          },
        };
      },
      undefined,
      "RESTART_GAME",
    ),
  updateGameState: (gameStateUpdate) =>
    set(
      ({ gameState }) => ({
        gameState: {
          ...gameState,
          ...gameStateUpdate,
          lastUpdated: Date.now(),
        },
      }),
      undefined,
      "UPDATE_GAME_STATE",
    ),

  initializeGameState: () =>
    set(
      () => ({
        ...initialState,
      }),
      undefined,
      "INITIALIZE_GAMESTATE",
    ),
});
