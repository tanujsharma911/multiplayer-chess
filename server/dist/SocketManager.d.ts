import type { Socket } from "socket.io";
export declare class User {
    userId: string;
    socket: Socket;
    inGame: boolean;
    email?: string;
    name?: string;
    avatar?: string;
    constructor(userId: string, email: string, name: string, avatar: string, socket: Socket);
    setSocket(socket: Socket): void;
}
//# sourceMappingURL=SocketManager.d.ts.map