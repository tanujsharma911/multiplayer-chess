import type { User } from "../SocketManager.js";
export declare function saveFinishedGame(params: {
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
    }[];
    chats: {
        message: string;
        time: Date;
        from: string;
    }[];
}): Promise<any>;
//# sourceMappingURL=game.repository.d.ts.map