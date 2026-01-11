import { Chess } from "chess.js";
import type { User } from "./SocketManager.js";
export declare class Game {
    player1: User;
    player2: User;
    board: Chess;
    startTime: Date;
    lastPlayedAt: Date | null;
    clocks: {
        w: number;
        b: number;
    };
    moveTimeout: NodeJS.Timeout | null;
    isSaved: boolean;
    chats: {
        message: string;
        time: Date;
        from: string;
    }[];
    constructor(p1: User, p2: User);
    makeMove(player: User, move: {
        from: string;
        to: string;
    }): "error" | "move" | "time_out" | "game_over";
    startTurnTimer(playerColor: "b" | "w"): void;
    endGameByTimeout(winner: "w" | "b"): void;
    playerLeft(user: User): void;
    playerResign(user: User): void;
    chat(user: User, message: string): void;
    saveGame(result: "w" | "b" | "draw", reason: string): Promise<any> | undefined;
}
//# sourceMappingURL=Game.d.ts.map