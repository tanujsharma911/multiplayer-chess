import { create } from "zustand";
import { GAME_OVER, INIT_GAME, INQUEUE } from "../App";

type game = {
  turn?: "w" | "b" | null;
  you?: "w" | "b" | null;
  status?: typeof INIT_GAME | typeof INQUEUE | typeof GAME_OVER | "none";
  opponent?: {
    name?: string;
    email?: string;
    avatar?: string;
    userId?: string;
  };
  winner?: "w" | "b" | undefined;
};

export const useGame = create<{
  game: game;
  setQueue: () => void;
  setGame: (data: game) => void;
  setOver: (winner?: "w" | "b") => void;
  setTurn: (data: "w" | "b") => void;
}>((set) => ({
  game: {
    turn: null,
    you: null,
    status: "init_game",
    opponent: {
      name: "",
      email: "",
      avatar: "",
      userId: "",
    },
    winner: undefined,
  },
  setQueue: () =>
    set((state) => ({
      ...state,
      game: {
        turn: null,
        you: null,
        opponent: { name: "", email: "", avatar: "", userId: "" },
        winner: undefined,
        status: INQUEUE,
      },
    })),
  setGame: (data: game) =>
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        turn: data.turn,
        you: data.you,
        status: INIT_GAME,
        opponent: data.opponent,
      },
    })),
  setTurn: (data: "w" | "b") =>
    set((state) => ({ game: { ...state.game, turn: data } })),
  setOver: (winner?: "w" | "b") =>
    set((state) => ({ game: { ...state.game, status: GAME_OVER, winner } })),
}));
