// server/src/repositories/game.repository.ts
import { Game } from "../models/game.model.js";
export async function saveFinishedGame(params) {
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
//# sourceMappingURL=game.repository.js.map