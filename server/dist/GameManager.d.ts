import { User } from './SocketManager.js';
export declare class GameManager {
    private games;
    private users;
    private pendingUser;
    constructor();
    addUser(user: User): void;
    removeUser(user: User): void;
    addHandler(user: User): void;
}
//# sourceMappingURL=GameManager.d.ts.map