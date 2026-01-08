import { create } from "zustand";
import { GAME_OVER, INIT_GAME, INQUEUE } from "../App";

interface gameStore {
  game: gameStoreType;
  setQueue: () => void;
  setGame: (payload: gameStoreType) => void;
  setOver: (payload: { reason: string; result?: "w" | "b" | "draw" }) => void;
  setTurn: (payload: "w" | "b") => void;
  setChat: (payload: { message: string; time: string; from: string }) => void;
}

type gameStoreType = {
  turn?: "w" | "b" | null;
  you?: "w" | "b" | null;
  status?: string;
  opponent?: {
    name?: string;
    email?: string;
    avatar?: string;
    userId?: string;
  };
  result?: "w" | "b" | "draw" | undefined;
  reason?: string;
  chats?: { time: string; message: string; from: string }[];
};

const defaultState: gameStoreType = {
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
  chats: [],
};

const handleSetQueue = (state: gameStore) => {
  return {
    ...state,
    game: {
      ...state.game,
      turn: null,
      you: null,
      opponent: { name: "", email: "", avatar: "", userId: "" },
      result: undefined,
      status: INQUEUE,
    },
  };
};

const handleSetGame = (state: gameStore, payload: gameStoreType) => {
  return {
    ...state,
    game: {
      ...state.game,
      turn: payload.turn,
      you: payload.you,
      status: INIT_GAME,
      opponent: payload.opponent,
    },
  };
};

const handleSetOver = (
  state: gameStore,
  payload: { reason?: string; result?: "w" | "b" | "draw" }
) => {
  return {
    ...state,
    game: {
      ...state.game,
      status: GAME_OVER,
      result: payload.result,
      reason: payload.reason,
    },
  };
};

const handleSetChat = (
  state: gameStore,
  payload: { message: string; time: string; from: string }
) => {
  console.log("Adding chat to store:", payload);
  return {
    game: {
      ...state.game,
      chats: [
        ...(state.game.chats || []),
        { time: payload.time, from: payload.from, message: payload.message },
      ],
    },
  };
};

export const useGame = create<gameStore>((set) => ({
  game: defaultState,

  /* -------------------------------------- Methods ---------------------------------- */
  setQueue: () => set((store) => handleSetQueue(store)),

  setGame: (payload: gameStoreType) =>
    set((state) => handleSetGame(state, payload)),

  setTurn: (data: "w" | "b") =>
    set((state) => ({ game: { ...state.game, turn: data } })),

  setOver: (payload: { reason?: string; result?: "w" | "b" | "draw" }) =>
    set((state) => handleSetOver(state, payload)),

  setChat: (payload: { message: string; time: string; from: string }) =>
    set((state) => handleSetChat(state, payload)),
}));
