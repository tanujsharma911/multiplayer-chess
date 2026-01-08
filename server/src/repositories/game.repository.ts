// server/src/repositories/game.repository.ts
import { Game } from "../models/game.model.js";
import type { User } from "../SocketManager.js";

export async function saveFinishedGame(params: {
  player1: User;
  player2: User;
  result: "w" | "b" | "draw" | null;
  reason: string;
  startedAt: Date;
  endedAt: Date;
  moves: {
    after: string;
    before: string;
    color: string;
    from: string;
    to: string;
    lan: string;
    san: string;
    piece: string;
  }[]; // or a proper type
  chats: {
    message: string;
    time: Date;
    from: string;
  }[];
}) {
  const player1Id = params.player1.userId;
  const player2Id = params.player2.userId;
  return Game.create({
    player1: player1Id,
    player2: player2Id,
    moves: params.moves,
    result: params.result,
    startedAt: params.startedAt,
    chats: params.chats,
    reason: params.reason,
  });
}
