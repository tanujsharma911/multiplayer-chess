export class User {
    userId;
    socket;
    inGame;
    email;
    name;
    avatar;
    constructor(userId, email, name, avatar, socket) {
        this.userId = userId;
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