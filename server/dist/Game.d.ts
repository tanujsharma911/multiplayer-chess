import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js';
import type { User } from './SocketManager.js';
export declare class Game {
    gameId: string;
    player1: User;
    player2: User;
    board: Chess;
    startTime: Date;
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
    moves: {
        color: Color;
        from: Square;
        to: Square;
        piece: PieceSymbol;
        flags: string;
        san: string;
        lan: string;
        before: string;
        after: string;
    }[];
    constructor(p1: User, p2: User);
    makeMove(player: User, move: {
        from: string;
        to: string;
    }): "error" | "move" | "time_out" | "game_over";
    startTurnTimer(playerColor: 'b' | 'w'): void;
    endGameByTimeout(winner: 'w' | 'b'): void;
    playerLeft(user: User): void;
    playerResign(user: User): void;
    chat(user: User, message: string): void;
    gameOver(): void;
    saveGame(result: 'w' | 'b' | 'draw', reason: string): Promise<any> | undefined;
}
//# sourceMappingURL=Game.d.ts.map