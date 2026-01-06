import type { Socket } from "socket.io";
import { Chess } from "chess.js";
import { ERROR, GAME_OVER, MOVE, EXIT_GAME } from "./messages.js";
import type { User } from "./SocketManager.js";

/*
NOTE: Player 1 is Black, Player 2 is White
*/

export class Game {
  public player1: User;
  public player2: User;
  public board: Chess;
  private moves: string[];
  private startTime;

  constructor(p1: User, p2: User) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.moves = this.board.moves();
    this.startTime = new Date();
  }

  makeMove(player: User, move: { from: string; to: string }) {
    const playerColor = player.userId === this.player1.userId ? "b" : "w";

    if (playerColor !== this.board.turn()) {
      // Not your turn
      console.log("⚠️ Not your turn", player.email, move);

      player.socket.emit("message", {
        type: ERROR,
        payload: { message: "Not your turn" },
      });
      return;
    }

    const moved = this.board.move({ from: move.from, to: move.to });

    if (!moved) {
      // Illegal move
      console.log("⚠️ Illegal move", player.email, move);

      player.socket.emit("message", {
        type: ERROR,
        payload: { message: "Illegal move" },
      });
    }

    const broadcast = {
      board: this.board.fen(),
      move: moved,
      turn: this.board.turn(),
      gameStartedAt: this.startTime,
    };

    this.player1.socket.emit("message", {
      type: MOVE,
      payload: broadcast,
    });
    this.player2.socket.emit("message", {
      type: MOVE,
      payload: broadcast,
    });

    if (this.board.isGameOver()) {
      const winner = this.board.isCheckmate()
        ? this.board.turn() === "w"
          ? "b"
          : "w"
        : "draw";

      this.player1.socket.emit("message", {
        type: GAME_OVER,
        payload: { winner },
      });
      this.player2.socket.emit("message", {
        type: GAME_OVER,
        payload: { winner },
      });
      console.log("💀 Gameover", {
        between: this.player1.email + " V/S " + this.player2.email,
        winner: winner,
      });

      // mark players not in game
      this.player1.inGame = false;
      this.player2.inGame = false;

      return GAME_OVER;
    }

    return MOVE;
  }

  playerLeft(user: User) {
    const game = this;

    // Notify the other player
    if (game?.player1 === user) {
      game.player2.socket.emit("message", {
        type: EXIT_GAME,
        payload: { winner: "b" },
      });
    } else if (game?.player2 === user) {
      game.player1.socket.emit("message", {
        type: EXIT_GAME,
        payload: { winner: "w" },
      });
    }

    this.player1.inGame = false;
    this.player2.inGame = false;

    console.log("🚪 Gameover due to player leaving", user.email);
  }
}
