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
  result?: "w" | "b" | "draw" | undefined;
  reason?: string;
};

export const useGame = create<{
  game: game;
  setQueue: () => void;
  setGame: (payload: game) => void;
  setOver: (payload: { reason: string; result?: "w" | "b" | "draw" }) => void;
  setTurn: (payload: "w" | "b") => void;
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
    result: undefined,
    reason: undefined,
  },
  setQueue: () =>
    set((state) => ({
      ...state,
      game: {
        turn: null,
        you: null,
        opponent: { name: "", email: "", avatar: "", userId: "" },
        result: undefined,
        status: INQUEUE,
      },
    })),
  setGame: (payload: game) =>
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        turn: payload.turn,
        you: payload.you,
        status: INIT_GAME,
        opponent: payload.opponent,
      },
    })),
  setTurn: (data: "w" | "b") =>
    set((state) => ({ game: { ...state.game, turn: data } })),
  setOver: (payload: { reason?: string; result?: "w" | "b" | "draw" }) =>
    set((state) => ({
      game: {
        ...state.game,
        status: GAME_OVER,
        result: payload.result,
        reason: payload.reason,
      },
    })),
}));
