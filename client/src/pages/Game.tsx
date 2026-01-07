import { Chess } from "chess.js";
import Board from "../components/Board";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import { GAME_OVER, INIT_GAME, INQUEUE, MOVE, RESIGN } from "../App";
import { useGame } from "../store/game";
import useUser from "@/store/user";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";

type messageType = {
  type: string;
  payload: {
    board: string;
    turn: "w" | "b";
    move: MoveType;
  };
};

interface MoveType {
  after?: string;
  before?: string;
  color?: string;
  from?: string;
  to?: string;
  lan?: string;
  san?: string;
  piece?: string;
}

const moveSound = new Audio("/sounds/move.wav");

const Game = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { game, setTurn } = useGame();
  const { user } = useUser();

  const [chess, setChess] = useState(new Chess());
  const [moves, setMoves] = useState<MoveType[]>([]);
  const [boardVerision, setBoardVerision] = useState(0);
  const [yourTimeLeft, setYourTimeLeft] = useState(10 * 60 * 1000);
  const [opponentTimeLeft, setOpponentTimeLeft] = useState(10 * 60 * 1000);
  const [gameoverDialog, setGameoverDialog] = useState(true);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("message", { type: INIT_GAME });

    const handler = (msg: messageType) => {
      if (msg.type === MOVE) {
        const newChess = new Chess(msg.payload.board);

        if (!chess.isGameOver()) {
          moveSound.play();
        }

        setBoardVerision((v) => v + 1);

        setMoves((prev) => [...prev, msg.payload.move]);

        setChess(newChess);

        setTurn(msg.payload.turn);
      }
    };

    socket.on("message", handler);

    const onLoad = () => {
      setGameoverDialog(true);
    };

    onLoad();
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (game.status !== INIT_GAME || !game.you) return;

      if (game.turn === game.you) {
        setYourTimeLeft((prev) => prev - 100);
      } else {
        setOpponentTimeLeft((prev) => prev - 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [game]);

  const handleResign = () => {
    if (!socket) return;

    socket.emit("message", {
      type: RESIGN,
    });
  };

  return !user.isLoggedIn ? (
    <div className="flex items-center justify-center h-full py-20">
      Please log in to play
    </div>
  ) : (
    <div className="h-full mt-4">
      <div className="mx-auto max-w-5xl gap-5 grid grid-cols-1 lg:grid-cols-[auto_1fr]">
        {/* Board */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center mb-2 justify-between">
            {game.status === INQUEUE ? (
              <div className="flex items-center mb-2 gap-4 cursor-progress">
                <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse" />

                <div className="flex-1 h-4 w-40 bg-gray-600 animate-pulse rounded" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src={
                    game.opponent?.avatar ||
                    "https://api.dicebear.com/9.x/thumbs/svg?seed=opponent"
                  }
                  alt="opponent avatar"
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                {game.opponent?.name || "Opponent"}
              </div>
            )}
            <div>
              <Clock className="inline-block mr-2" />
              {Math.floor(opponentTimeLeft / 1000 / 60)}:
              {(Math.floor(opponentTimeLeft / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          </div>
          <Board chess={chess} boardVerision={boardVerision} socket={socket} />
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatar ||
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=you"
                }
                alt="your avatar"
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
              {user.name}
            </div>

            <div>
              <Clock className="inline-block mr-2" />
              {Math.floor(yourTimeLeft / 1000 / 60)}:
              {(Math.floor(yourTimeLeft / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-800 min-w-sm p-5 rounded-xl overflow-scroll">
          <div className="grid grid-cols-2 mb-4 gap-4">
            {game.status === INIT_GAME && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleResign}
                    className="py-6"
                  >
                    <Flag />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resign</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="grid grid-cols-2">
            {moves.map((move, index) => (
              <div
                key={index}
                className="flex items-center gap-6 py-1 px-2 rounded"
              >
                <div className="text-gray-500">
                  {index % 2 === 0 && index / 2 + 1 + "."}
                </div>
                <div>{move.san}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={game.status === GAME_OVER && gameoverDialog}
        // open={true}
        onOpenChange={setGameoverDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col gap-4 items-center justify-center">
              <p className="text-2xl font-bold">
                {game.result === "b"
                  ? "Black Won"
                  : game.result === "w"
                  ? "White Won"
                  : "Draw"}
              </p>
              <p className="text-lg font-medium">
                {game.reason || "No reason provided"}
              </p>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4"></div>
          <DialogFooter>
            <Button type="submit" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Game;
