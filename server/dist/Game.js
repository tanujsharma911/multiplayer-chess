import { saveFinishedGame } from './repositories/game.repository.js';
import { Chess } from 'chess.js';
import { ERROR, GAME_OVER, MOVE, EXIT_GAME, TIME_OUT, CHAT, } from './messages.js';
import { randomUUID } from 'crypto';
/*
NOTE: Player 1 is Black, Player 2 is White

10 min game
*/
export class Game {
    gameId;
    player1;
    player2;
    board;
    startTime;
    clocks = {
        w: 10 * 60 * 1000, // 1 minutes in ms
        b: 10 * 60 * 1000,
    };
    moveTimeout = null;
    isSaved = false;
    chats = [];
    moves = [];
    constructor(p1, p2) {
        this.gameId = randomUUID();
        this.player1 = p1;
        this.player2 = p2;
        this.board = new Chess();
        this.startTime = new Date();
        // mark players in game
        this.player1.inGame = true;
        this.player2.inGame = true;
        this.player1.gameId = this.gameId;
        this.player2.gameId = this.gameId;
        this.startTurnTimer('w');
    }
    makeMove(player, move) {
        const playerColor = player.userId === this.player1.userId ? 'b' : 'w';
        const elapsed = new Date();
        // Check if it's the player's turn
        if (playerColor !== this.board.turn()) {
            // Not your turn
            player.socket.emit('message', {
                type: ERROR,
                payload: { message: 'Not your turn' },
            });
            return ERROR;
        }
        // Check for time exceeded
        if (elapsed.getTime() < this.startTime.getTime() ||
            this.startTime.getTime() + 10 * 60 * 1000 < elapsed.getTime()) {
            console.log('⚠️ Game time exceeded', player.email, move);
            player.socket.emit('message', {
                type: ERROR,
                payload: { message: 'Game time exceeded' },
            });
            return ERROR;
        }
        // Make the move
        const moved = this.board.move({
            from: move.from,
            to: move.to,
            promotion: 'q',
        });
        // If the move is invalid, 'moved' will be null
        if (!moved) {
            // Illegal move
            console.log('⚠️ Illegal move', player.email, move);
            player.socket.emit('message', {
                type: ERROR,
                payload: { message: 'Illegal move' },
            });
        }
        this.moves.push({
            color: moved.color,
            from: moved.from,
            to: moved.to,
            piece: moved.piece,
            flags: moved.flags,
            san: moved.san,
            lan: moved.lan,
            before: moved.before,
            after: moved.after,
        });
        // Check for timeout
        if (this.clocks[playerColor] < 0) {
            this.endGameByTimeout(playerColor === 'w' ? 'b' : 'w');
            this.gameOver();
            this.saveGame(playerColor === 'w' ? 'b' : 'w', 'timeout');
            return TIME_OUT;
        }
        const broadcast = {
            board: this.board.fen(),
            move: moved,
            turn: this.board.turn(),
            gameStartedAt: this.startTime,
        };
        // Broadcast the move to both players
        this.player1.socket.emit('message', {
            type: MOVE,
            payload: broadcast,
        });
        this.player2.socket.emit('message', {
            type: MOVE,
            payload: broadcast,
        });
        // Start timeout for the next player
        this.startTurnTimer(this.board.turn());
        // Check for game over
        if (this.board.isGameOver()) {
            const result = this.board.isCheckmate()
                ? this.board.turn() === 'w'
                    ? 'b'
                    : 'w'
                : 'draw';
            const isCheckmate = this.board.isCheckmate();
            this.player1.socket.emit('message', {
                type: GAME_OVER,
                payload: { reason: isCheckmate ? 'checkmate' : 'draw', result },
            });
            this.player2.socket.emit('message', {
                type: GAME_OVER,
                payload: { reason: isCheckmate ? 'checkmate' : 'draw', result },
            });
            console.log('💀 Gameover', {
                between: this.player1.email + ' V/S ' + this.player2.email,
                result: result,
            });
            this.gameOver();
            this.saveGame(result, isCheckmate ? 'checkmate' : 'draw');
            return GAME_OVER;
        }
        return MOVE;
    }
    startTurnTimer(playerColor) {
        this.moveTimeout && clearInterval(this.moveTimeout);
        this.moveTimeout = setInterval(() => {
            this.clocks[playerColor] -= 1000;
            if (this.clocks[playerColor] <= 0) {
                const winner = playerColor === 'w' ? 'b' : 'w';
                this.endGameByTimeout(winner);
            }
        }, 1000);
    }
    endGameByTimeout(winner) {
        this.moveTimeout && clearInterval(this.moveTimeout);
        this.player1.socket.emit('message', {
            type: TIME_OUT,
            payload: { reason: 'timeout', result: winner },
        });
        this.player2.socket.emit('message', {
            type: TIME_OUT,
            payload: { reason: 'timeout', result: winner },
        });
        console.log('💀 Gameover due to timeout', {
            between: this.player1.email + ' V/S ' + this.player2.email,
            result: winner,
        });
        this.gameOver();
    }
    playerLeft(user) {
        const game = this;
        // Notify the other player
        if (game.player1 === user) {
            game.player2.socket.emit('message', {
                type: EXIT_GAME,
                payload: { reason: 'Player Left', result: 'w' },
            });
        }
        else if (game.player2 === user) {
            game.player1.socket.emit('message', {
                type: EXIT_GAME,
                payload: { reason: 'Player Left', result: 'b' },
            });
        }
        console.log('🚪 Gameover due to player leaving', user.email);
        this.gameOver();
    }
    playerResign(user) {
        const game = this;
        const playerColor = user.userId === game.player1.userId ? 'b' : 'w';
        // Notify the other player
        game.player2.socket.emit('message', {
            type: EXIT_GAME,
            payload: {
                reason: 'Player Left',
                result: playerColor === 'w' ? 'b' : 'w',
            },
        });
        game.player1.socket.emit('message', {
            type: EXIT_GAME,
            payload: {
                reason: 'Player Left',
                result: playerColor === 'b' ? 'w' : 'b',
            },
        });
        this.player1.inGame = false;
        this.player2.inGame = false;
        console.log('🚪 Gameover due to player leaving', user.email);
        this.saveGame(playerColor === 'w' ? 'b' : 'w', 'resign');
        this.gameOver();
    }
    chat(user, message) {
        const game = this;
        console.log('💬 Chat message', { from: user.email, message });
        this.chats.push({
            message,
            time: new Date(),
            from: user.userId === game.player1.userId ? 'b' : 'w',
        });
        // Broadcast the chat message to both players
        game.player1.socket.emit('message', {
            type: CHAT,
            payload: {
                from: user.userId === game.player1.userId ? 'b' : 'w',
                message,
                time: new Date(),
            },
        });
        game.player2.socket.emit('message', {
            type: CHAT,
            payload: {
                from: user.userId === game.player1.userId ? 'b' : 'w',
                message,
                time: new Date(),
            },
        });
    }
    gameOver() {
        // mark players not in game
        this.player1.inGame = false;
        this.player2.inGame = false;
        this.player1.gameId = null;
        this.player2.gameId = null;
    }
    saveGame(result, reason) {
        if (!this.isSaved) {
            this.isSaved = true;
            console.log('💾 Saving finished game...');
            return saveFinishedGame({
                player1: this.player1,
                player2: this.player2,
                result: result,
                reason: reason,
                startedAt: this.startTime,
                endedAt: new Date(),
                moves: this.board.history({ verbose: true }),
                chats: this.chats,
            });
        }
    }
}
//# sourceMappingURL=Game.js.map