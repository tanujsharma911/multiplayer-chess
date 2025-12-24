import type { Socket } from "socket.io";
import { INIT_GAME } from "./messages.js";

export class GameManager {
  private games: Game[];
  private users: Socket[];
  private pendingUser: Socket;

  constructor() {
    this.games = [];
    this.users = [];
  }

  addUser(socket: Socket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: Socket) {
    this.users.filter((user) => user !== socket);

    //TODO: Stop the game because user left the game
    //TODO: or can have reconnect logic
  }

  private addHandler(socket: Socket) {
    socket.on("message", (msg) => {
      const message = JSON.parse(msg.toString());

      if (message.type === INIT_GAME) {
        if(this.pendingUser) {
            // Start the game
        }
        else {
            // put user in pending
            this.pendingUser = socket;
        }
      }
    });
  }
}
