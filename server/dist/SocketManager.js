export class User {
    userId;
    socket;
    inGame;
    gameId;
    email;
    name;
    avatar;
    constructor(userId, gameId, email, name, avatar, socket) {
        this.userId = userId;
        this.gameId = gameId;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
        this.socket = socket;
        this.inGame = false;
    }
    setSocket(socket) {
        this.socket = socket;
    }
}
//# sourceMappingURL=SocketManager.js.map