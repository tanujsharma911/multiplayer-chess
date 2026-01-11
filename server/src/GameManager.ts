import {
  ERROR,
  GAME_OVER,
  INIT_GAME,
  INQUEUE,
  MOVE,
  EXIT_GAME,
  TIME_OUT,
  RESIGN,
  CHAT,
} from "./messages.js";
import { Game } from "./Game.js";
import { User } from "./SocketManager.js";

export class GameManager {
  private games: Game[]; // TODO: Use map
  private users: User[];
  private pendingUser: User | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(user: User) {
    const existingUser = this.users.find((u) => u.userId === user.userId);

    if (existingUser) {
      try {
        // detach previous handlers (if any) to avoid duplicates
        existingUser.socket.off("message", () => {});
      } catch (e) {}

      existingUser.setSocket(user.socket);
      console.log("🔄 User socket updated:", user.email);

      this.addHandler(user);

      return existingUser;
    } else {
      // Add new user
      this.users.push(user);

      this.addHandler(user);

      return user;
    }
  }

  removeUser(user: User) {
    this.users = this.users.filter((u) => u !== user);

    if (this.pendingUser?.userId === user.userId) this.pendingUser = null;

    // Remove user from any active games
    const game = this.games.find(
      (g) =>
        g.player1.userId === user.userId || g.player2.userId === user.userId
    );
    if (game) {
      game.playerLeft(user);

      this.games = this.games.filter((g) => g !== game);
    }
  }

  addHandler(user: User) {
    user.socket.on("message", (msg) => {
      const message = JSON.parse(JSON.stringify(msg));

      // --------------------------------- INIT_GAME ----------------------------------
      // NOTE: For high concurrency use a proper lock or queue library.

      if (message.type === INIT_GAME) {
        // If user is already in a game, reject
        if (user.inGame) {
          user.socket.emit("message", {
            type: ERROR,
            payload: { message: "Already in a game" },
          });
          return;
        }

        if (!this.pendingUser) {
          // put user in pending
          this.pendingUser = user;

          console.log("⏳ User is in queue...");

          user.socket.emit("message", { type: INQUEUE, payload: {} });
        } else if (this.pendingUser.userId === user.userId) {
          // If the pending user is the same as the current user
          // user re-requested; just keep them in queue

          user.socket.emit("message", { type: INQUEUE, payload: {} });
        } else {
          // If there's a pending user, start the game
          // Start the game

          const game = new Game(this.pendingUser, user);
          this.games.push(game);

          this.pendingUser = null;

          console.log("🧩 Game started", this.games.length);

          game.player1.socket.emit("message", {
            type: INIT_GAME,
            payload: {
              you: "b",
              turn: game.board.turn(),
              opponent: {
                name: game.player2.name,
                email: game.player2.email,
                avatar: game.player2.avatar,
                userId: game.player2.userId,
              },
            },
          });
          game.player2.socket.emit("message", {
            type: INIT_GAME,
            payload: {
              you: "w",
              turn: game.board.turn(),
              opponent: {
                name: game.player1.name,
                email: game.player1.email,
                avatar: game.player1.avatar,
                userId: game.player1.userId,
              },
            },
          });
        }
      }
      // --------------------------------- MOVE ----------------------------------
      else if (message.type === MOVE) {
        const game = this.games.find(
          (board) =>
            board.player1.userId === user.userId ||
            board.player2.userId === user.userId
        );

        if (game) {
          const gameStatus = game.makeMove(user, message.move);
          if (gameStatus === GAME_OVER || gameStatus === TIME_OUT) {
            // Remove the game from active games
            this.games = this.games.filter((g) => g !== game);
          }
        } else {
          user.socket.emit("message", {
            type: ERROR,
            payload: { message: "no game found in which you are" },
          });
        }
      }
      // --------------------------------- RESIGN ----------------------------------
      else if (message.type === RESIGN) {
        const game = this.games.find(
          (board) =>
            board.player1.userId === user.userId ||
            board.player2.userId === user.userId
        );
        if (game) {
          game.playerResign(user);
          this.games = this.games.filter((g) => g !== game);
        } else {
          user.socket.emit("message", {
            type: ERROR,
            payload: { message: "no game found in which you are" },
          });
        }
      }
      // --------------------------------- CHAT ----------------------------------
      else if (message.type === CHAT) {
        const game = this.games.find(
          (board) =>
            board.player1.userId === user.userId ||
            board.player2.userId === user.userId
        );
        if (game) {
          game.chat(user, message.payload);
        } else {
          user.socket.emit("message", {
            type: ERROR,
            payload: { message: "no game found in which you are" },
          });
        }
      }
    });
  }
}
