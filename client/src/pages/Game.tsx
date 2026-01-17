import { Chess, type Square } from 'chess.js';
import Board from '../components/Board';
import { useSocketStore } from '../store/socket';
import { useEffect, useState } from 'react';
import {
  GAME_OVER,
  GET_ME,
  INIT_GAME,
  INQUEUE,
  MOVE,
  PLAYER_LEFT,
  RESIGN,
} from '../App';
import { useGame } from '../store/game';
import useUser from '@/store/user';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router';
import Moves from '@/components/Moves';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatsPanel from '@/components/ChatsPanel';

type messageType = {
  type: string;
  payload: {
    board?: string;
    turn?: 'w' | 'b';
    move: MoveType;
    inGame?: boolean;
    you?: 'b' | 'w';
    opponent?: {
      name?: string;
      email?: string;
      avatar?: string;
      userId?: string;
    };
    gameId?: string | null;
    moves?: MoveType[];
    chats?: { time: string; message: string; from: string }[];
    clock?: { w: number; b: number };
  };
};

export interface MoveType {
  after?: string;
  before?: string;
  color?: string;
  from?: string;
  to?: string;
  lan?: string;
  san?: string;
  piece?: string;
}

const moveSound = new Audio('/sounds/move.wav');

const Game = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { game, setGame, setTurn, setClear } = useGame();
  const { user } = useUser();

  const [chess, setChess] = useState(new Chess());
  const [moves, setMoves] = useState<MoveType[]>([]);
  const [yourTimeLeft, setYourTimeLeft] = useState(10 * 60 * 1000);
  const [opponentTimeLeft, setOpponentTimeLeft] = useState(10 * 60 * 1000);
  const [gameoverDialog, setGameoverDialog] = useState(true);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit('message', { type: GET_ME });

    const messageHandler = (msg: messageType) => {
      if (msg.type === GET_ME) {
        if (msg.payload.inGame === true) {
          navigate('/game/' + msg.payload.gameId);
          const position = msg.payload.board;

          setChess(new Chess(position));

          if (msg.payload.moves) setMoves(msg.payload.moves);

          setGame({
            gameId: msg.payload.gameId,
            you: msg.payload.you,
            opponent: msg.payload.opponent,
            turn: msg.payload.turn,
            chats: msg.payload.chats,
          });

          const clock = msg.payload.clock;

          if (clock && msg.payload.you) setYourTimeLeft(clock[msg.payload.you]);
          if (clock && msg.payload.you)
            setOpponentTimeLeft(clock[msg.payload.you === 'w' ? 'b' : 'w']);

          if (msg.payload.moves) setMoves(msg.payload.moves);
        } else {
          navigate('/game/random');
          socket.emit('message', { type: INIT_GAME });

          setGameoverDialog(true);
          setChess(new Chess());
          setYourTimeLeft(10 * 60 * 1000);
          setOpponentTimeLeft(10 * 60 * 1000);
          setMoves([]);
          setClear();
        }
      }
      if (msg.type === MOVE) {
        const newChess = new Chess(msg.payload.board);

        if (!chess.isGameOver()) {
          moveSound.play();
        }

        if (msg.payload.move) setMoves((prev) => [...prev, msg.payload.move]);

        setChess(newChess);

        if (msg.payload.turn) setTurn(msg.payload.turn);
      }
    };

    socket.on('message', messageHandler);

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

    return () => {
      clearInterval(interval);
      socket?.emit('message', {
        type: PLAYER_LEFT,
      });
    };
  }, [game]);

  const handleResign = () => {
    if (!socket) return;

    socket.emit('message', {
      type: RESIGN,
    });
  };

  const handleDragEnd = (from: Square, to: Square) => {
    socket?.emit('message', {
      type: MOVE,
      move: { from: from, to: to },
    });
  };

  return !user.isLoggedIn ? (
    <div className="flex items-center justify-center h-full py-20">
      Please log in to play
    </div>
  ) : (
    <div className="grid grid-cols-1 grid-rows-1 mt-10">
      <div className="px-5 mx-auto max-w-4xl w-full gap-5 grid grid-cols-1 md:grid-cols-5 grid-rows-1">
        {/* Board */}
        <div className="flex flex-col gap-2 col-span-3">
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
                    'https://api.dicebear.com/9.x/thumbs/svg?seed=opponent'
                  }
                  alt="opponent avatar"
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                {game.opponent?.name || 'Opponent'}
              </div>
            )}
            <div>
              <Clock className="inline-block mr-2" />
              {Math.floor(opponentTimeLeft / 1000 / 60)}:
              {(Math.floor(opponentTimeLeft / 1000) % 60)
                .toString()
                .padStart(2, '0')}
            </div>
          </div>
          <Board
            chess={chess}
            blackBottom={game.you === 'b'}
            onDragEnd={handleDragEnd}
            yourColor={game.you || undefined}
            className="sm:max-w-[70vw]"
          />
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatar ||
                  'https://api.dicebear.com/9.x/thumbs/svg?seed=you'
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
                .padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-accent h-full p-5 rounded-xl grid-rows-[auto_1fr] col-span-2">
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

          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="moves">Moves</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="overflow-y-auto h-[60vh]">
              <ChatsPanel />
            </TabsContent>
            <TabsContent value="moves" className="overflow-y-auto h-[60vh]">
              <Moves moves={moves} />
            </TabsContent>
          </Tabs>
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
                {game.result === 'b'
                  ? 'Black Won'
                  : game.result === 'w'
                    ? 'White Won'
                    : 'Draw'}
              </p>
              <p className="text-lg font-medium">
                {game.reason || 'No reason provided'}
              </p>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4"></div>
          <DialogFooter>
            <Button type="submit" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Game;
