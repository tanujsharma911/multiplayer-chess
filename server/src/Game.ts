import type { Socket } from "socket.io";
import { Chess } from "chess.js";
import { ERROR, GAME_OVER, MOVE } from "./messages.js";

export class Game {
  public player1: Socket;
  public player2: Socket;
  public board: Chess;
  private moves: string[];
  private startTime;

  constructor(p1: Socket, p2: Socket) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.moves = this.board.moves();
    this.startTime = new Date();
  }

  makeMove(game: Game, player: Socket, move: { from: string; to: string }) {
    // It is the user move?
    try {
      const moved = this.board.move({ from: move.from, to: move.to });

      game.player1.emit("message", {
        type: MOVE,
        payload: {
          board: this.board.fen(),
          move: moved,
          turn: this.board.turn(),
        },
      });
      game.player2.emit("message", {
        type: MOVE,
        payload: {
          board: this.board.fen(),
          move: moved,
          turn: this.board.turn(),
        },
      });
    } catch (error) {
      // Illegal move
      console.log("⚠️ Illegal move", error);

      player.emit("message", {
        type: ERROR,
        payload: { message: "Illegal move" },
      });
      return;
    }

    // Check is the heckmate/stalemate
    if (this.board.isGameOver()) {
      this.player1.emit("message", {
        type: GAME_OVER,
        winner: this.board.turn() === "w" ? "b" : "w",
      });
      this.player2.emit("message", {
        type: GAME_OVER,
        winner: this.board.turn() === "w" ? "b" : "w",
      });
      console.log("💀 Gameover");
      return;
    }
  }
}
