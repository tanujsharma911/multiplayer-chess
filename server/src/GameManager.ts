import type { Socket } from "socket.io";

import { ERROR, INIT_GAME, INQUEUE, MOVE } from "./messages.js";
import { Game } from "./Game.js";
import { Chess } from "chess.js";

export class GameManager {
  private games: Game[];
  private users: Socket[];
  private pendingUser: Socket | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(socket: Socket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: Socket) {
    this.users.filter((user) => user !== socket);

    if (this.pendingUser === socket) this.pendingUser = null;

    

    //TODO: Stop the game because user left the game
    //TODO: or can have reconnect logic
  }

  addHandler(socket: Socket) {
    socket.on("message", (msg) => {
      const message = JSON.parse(JSON.stringify(msg));

      console.log("🗣️ User message:", message);

      // --------------------------------- INIT_GAME ----------------------------------
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          // Start the game

          const game = new Game(this.pendingUser, socket);
          this.games.push(game);

          this.pendingUser = null;

          console.log("🧩 Game started");

          game.player1.emit("message", {
            type: INIT_GAME,
            payload: { you: "b", turn: game.board.turn() },
          });
          game.player2.emit("message", {
            type: INIT_GAME,
            payload: { you: "w", turn: game.board.turn() },
          });
        } else {
          // put user in pending
          this.pendingUser = socket;

          console.log("⏳ User is in queue...");

          socket.emit("message", { type: INQUEUE, payload: {} });
        }
      }
      // --------------------------------- MOVE ----------------------------------
      else if (message.type === MOVE) {
        const game = this.games.find(
          (board) => board.player1 === socket || board.player2 === socket
        );

        if (game) {
          game.makeMove(game, socket, message.move);
        } else {
          socket.emit("message", {
            type: ERROR,
            payload: { message: "no game found in which you are" },
          });
        }
      }
    });
  }
}
