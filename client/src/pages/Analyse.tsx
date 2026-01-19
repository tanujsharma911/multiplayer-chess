import { api } from '@/api/api';
import Board from '@/components/Board';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { gameModelType } from './Account';
import Moves from '@/components/Moves';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatHistory from '@/components/ChatHistory';
import useUser from '@/store/user';
// import { getAnalysis } from '@/lib/utils';
import { Chess } from 'chess.js';

const Analyse = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user } = useUser();

  const [game, setGame] = useState<gameModelType | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // const setAnalysis = async (fen: string) => {
  //   await getAnalysis(fen);
  // };

  const handleMoveChange = async (move: number) => {
    if (!game) return;

    if (move < 0 || move >= game.moves.length) return;

    setCurrentMove(move);
    setCurrentPosition(game.moves[move].after);

    // await setAnalysis(game.moves[move].after);
  };

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await api
          .get(`/game/getgame?gameId=${gameId}`)
          .then((res) => res.data);

        setGame(response.game);

        await handleMoveChange(0);
        setCurrentPosition(response.game.moves[0].after);
        // await setAnalysis(response.game.moves[0].after);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Failed to load game details.');
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }
  if (!game) {
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  }
  return (
    <div className="grid grid-cols-1 grid-rows-1 mt-10">
      <div className="px-5 mx-auto max-w-4xl w-full gap-5 grid grid-cols-1 md:grid-cols-5 grid-rows-1">
        {/* Board */}
        <div className="flex flex-col gap-2 col-span-3">
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  game.player2?.avatar ||
                  'https://api.dicebear.com/9.x/thumbs/svg?seed=opponent'
                }
                alt="opponent avatar"
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
              {game.player2?.name || 'Opponent'}
            </div>
          </div>
          <Board
            chess={new Chess(currentPosition || undefined)}
            staticBoard={true}
            className="sm:max-w-[70vw]"
          />
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  game.player1.avatar ||
                  'https://api.dicebear.com/9.x/thumbs/svg?seed=you'
                }
                alt="your avatar"
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
              {game.player1.name}
            </div>
          </div>
        </div>
        {/* Details */}
        <div className="bg-accent h-full p-5 rounded-xl grid-rows-[auto_1fr] col-span-2">
          <div className="grid grid-cols-4 mb-4 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleMoveChange(0)}
                  className="py-6"
                >
                  <ChevronFirst />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to first move</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleMoveChange(currentMove - 1)}
                  className="py-6"
                >
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to previous move</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleMoveChange(currentMove + 1)}
                  className="py-6"
                >
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to next move</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleMoveChange(game.moves.length - 1)}
                  className="py-6"
                >
                  <ChevronLast />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to last move</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tabs defaultValue="moves">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="moves">Moves</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <div className="overflow-scroll bg-gray-900/50 h-[60vh] rounded-lg">
                <ChatHistory
                  chats={game.chats}
                  playerColor={
                    game.player1.email === user.email
                      ? 'b'
                      : game.player2.email === user.email
                        ? 'w'
                        : undefined
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="moves" className="overflow-y-auto h-[60vh]">
              <div className="overflow-scroll bg-background h-[60vh] rounded-lg">
                <Moves moves={game.moves} currentMove={currentMove} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analyse;
