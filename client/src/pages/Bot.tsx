import Board from '@/components/Board';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useUser from '@/store/user';
import { getAnalysis } from '@/lib/utils';
import { Chess, type Square } from 'chess.js';

const moveSound = new Audio('/sounds/move.wav');
const gameSound = new Audio('/sounds/game-end.mp3');

const bots = [
  {
    name: 'Aarav',
  },
  {
    name: 'Rohan',
  },
  {
    name: 'Kunal',
  },
  {
    name: 'Vikram',
  },
  {
    name: 'Anaya',
  },
  {
    name: 'Isha',
  },
  {
    name: 'Kavya',
  },
  {
    name: 'Neha',
  },
  {
    name: 'Pooja',
  },
  {
    name: 'Ritika',
  },
];

const PlayWithBot = () => {
  const { user } = useUser();

  const [game, setGame] = useState(new Chess());
  const [level, setLevel] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleDragEnd = async (from: Square, to: Square) => {
    if (level === null) return;

    const moved = game.move({ from, to });

    if (!moved) {
      console.error('Invalid move');
      return;
    }

    moveSound.play();

    setCurrentPosition(game.fen());
    setCurrentMove(currentMove + 1);

    const res = await getAnalysis(game.fen(), level);

    console.log(res);

    setTimeout(() => {
      game.move({ from: res.from, to: res.to });

      setCurrentPosition(game.fen());
      setCurrentMove(game.history().length);

      moveSound.play();

      if (game.isGameOver()) {
        gameSound.play();

        setIsGameOver(true);
      }
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 mt-10">
      {level === null ? (
        <div>
          <h1 className="scroll-m-20 mb-10 text-center text-4xl font-extrabold tracking-tight text-balance">
            Select Bot
          </h1>

          <div className="px-4 max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-5 pb-10 gap-4">
            {bots.map((bot, i) => {
              return (
                <button
                  key={bot.name}
                  onClick={() => {
                    setLevel(i + 3);
                  }}
                  className="flex items-center flex-col bg-accent gap-4 p-4 rounded-md hover:outline hover:bg-neutral-800 transition-all"
                >
                  <img
                    src={`/img/${i + 1}.png`}
                    alt={`${bot.name} avatar`}
                    className="w-10 h-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-bold">{bot.name}</div>
                    <div className="text-sm font-medium opacity-75">
                      {i * 200 + 600}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-5 mx-auto max-w-4xl w-full gap-5 grid grid-cols-1 md:grid-cols-5 grid-rows-1">
          {/* Board */}
          <div className="flex flex-col gap-2 col-span-3">
            <div className="flex items-center mb-2 justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`/img/${level - 2}.png`}
                  alt="opponent avatar"
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <div className="font-bold text-lg">{bots[level - 3].name}</div>
                <div className="font-medium text-sm">
                  {(level - 3) * 200 + 600}
                </div>
              </div>
            </div>
            <Board
              position={currentPosition || undefined}
              className="sm:max-w-[70vw]"
              yourColor={isGameOver ? undefined : 'w'}
              onDragEnd={handleDragEnd}
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
            </div>
          </div>

          {/* Details */}
          <div className="bg-accent h-full p-5 rounded-xl grid-rows-[auto_1fr] col-span-2">
            <div className="mb-4 gap-4 w-full">
              <Label htmlFor="bot-select" className="mb-2">
                Select Bot
              </Label>
              <Select
                defaultValue={level.toString()}
                onValueChange={(value) => setLevel(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Bot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bots</SelectLabel>
                    {bots.map((bot, i) => (
                      <SelectItem key={bot.name} value={(i + 3).toString()}>
                        <p className="flex items-baseline">
                          <strong className="mr-2">{bot.name}</strong>
                          {i * 200 + 600}
                        </p>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayWithBot;
