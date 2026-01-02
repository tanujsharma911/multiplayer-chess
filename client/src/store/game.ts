import { create } from "zustand";
import { GAME_OVER, INIT_GAME, INQUEUE } from "../App";

type game = {
  turn?: "w" | "b" | null;
  you?: "w" | "b" | null;
  status?: typeof INIT_GAME | typeof INQUEUE | typeof GAME_OVER | "none";
};

export const useGame = create<{
  game: game;
  setQueue: () => void;
  setGame: (data: game) => void;
  setOver: () => void;
  setTurn: (data: "w" | "b") => void;
}>((set) => ({
  game: {
    turn: null,
    you: null,
    status: "init_game",
  },
  setQueue: () =>
    set((state) => ({ ...state, game: { ...state.game, status: INQUEUE } })),
  setGame: (data: game) =>
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        turn: data.turn,
        you: data.you,
        status: INIT_GAME,
      },
    })),
  setTurn: (data: "w" | "b") =>
    set((state) => ({ game: { ...state.game, turn: data } })),
  setOver: () =>
    set((state) => ({ game: { ...state.game, status: GAME_OVER } })),
}));
