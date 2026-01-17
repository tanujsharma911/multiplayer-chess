import type { Socket } from "socket.io";

export class User {
  public userId: string;
  public socket: Socket;
  public inGame: boolean;
  public gameId: string | null;
  public email?: string;
  public name?: string;
  public avatar?: string;

  constructor(userId: string, gameId: string | null, email: string, name: string, avatar: string, socket: Socket) {
    this.userId = userId;
    this.gameId = gameId;
    this.email = email;
    this.name = name;
    this.avatar = avatar;
    this.socket = socket;
    this.inGame = false;
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }
}
